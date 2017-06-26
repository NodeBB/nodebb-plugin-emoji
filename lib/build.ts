import { access, writeFile, symlink } from 'fs';
import { join, basename } from 'path';
import { mkdirp, copy, remove } from 'fs-extra';
import * as async from 'async';

import * as cssBuilders from './css-builders';
import { clearCache } from './parse';
import { setOne as setSetting } from './settings';

const db = require.main.require('./src/database');

const assetsDir = join(__dirname, `../emoji`);

const linkDirs = (sourceDir: string, destDir: string, callback: NodeBack) => {
  const type = (process.platform === 'win32') ? 'junction' : 'dir';
  symlink(sourceDir, destDir, type, callback);
};

export const tableFile = join(assetsDir, 'table.json');
export const aliasesFile = join(assetsDir, 'aliases.json');
export const asciiFile = join(assetsDir, 'ascii.json');
export const categoriesFile = join(assetsDir, 'categories.json');
export const packsFile = join(assetsDir, 'packs.json');

const pluginData = require.main.require('./src/plugins').data;

export default function build(callback: NodeBack) {
  async.waterfall([
    // get all active plugin paths
    pluginData.getPluginPaths,
    // filter to only emoji packs
    (paths: string[], next: NodeBack) =>
      async.filter(paths, (path, next) => {
        async.some([
          join(path, 'emoji.json'),
          join(path, 'emoji.js'),
        ], (path, next) => {
          access(path, (err) => {
            if (err && err.code !== 'ENOENT') {
              next(err);
            } else {
              next(null, !err);
            }
          });
        }, next);
      }, next),
    // evaluate the emoji definitions
    (paths: string[], next: NodeBack) =>
      async.map(paths, (path, next) => {
        const pack: EmojiDefinition | AsyncEmojiDefinition = require(join(path, 'emoji'));

        if (typeof pack === 'function') {
          pack((err, pack) => next(err, [path, pack]));
        } else {
          next(null, [path, pack]);
        }
      }, next),
    // clear dirs
    (packs: [string, EmojiDefinition][], next: NodeBack) =>
      async.series([
        cb => remove(assetsDir, cb),
        cb => mkdirp(assetsDir, cb),
      ], (err: Error) => next(err, packs)),
    (packs: [string, EmojiDefinition][], next: NodeBack) => {
      const table: MetaData.table = {};
      const aliases: MetaData.aliases = {};
      const ascii: MetaData.ascii = {};

      const categoriesInfo: MetaData.categories = {};
      const packsInfo: MetaData.packs = packs.map(([, pack]) => ({
        name: pack.name,
        id: pack.id,
        attribution: pack.attribution,
        license: pack.license,
      }));

      packs.forEach(([, pack]) => {
        Object.keys(pack.dictionary).forEach((key) => {
          const name = key.toLowerCase();
          const emoji = pack.dictionary[key];

          table[name] = {
            name,
            character: emoji.character,
            image: emoji.image || '',
            pack: pack.id,
            aliases: emoji.aliases || [],
            keywords: emoji.keywords || [],
          };

          if (emoji.aliases) {
            emoji.aliases.forEach((alias) => {
              aliases[alias.toLowerCase()] = name;
            });
          }

          if (emoji.ascii) {
            emoji.ascii.forEach((str) => {
              ascii[str] = name;
            });
          }

          const categories = emoji.categories || ['other'];
          categories.forEach((category) => {
            categoriesInfo[category] = categoriesInfo[category] || [];
            categoriesInfo[category].push(name);
          });
        });
      });

      async.parallel([
        // generate CSS styles and store them
        (cb) => {
          const css = packs.map(([, pack]) => cssBuilders[pack.mode](pack)).join('\n');
          writeFile(join(assetsDir, 'styles.css'), css, { encoding: 'utf8' }, cb);
        },
        // persist metadata to disk
        cb => writeFile(tableFile, JSON.stringify(table), cb),
        cb => writeFile(aliasesFile, JSON.stringify(aliases), cb),
        cb => writeFile(asciiFile, JSON.stringify(ascii), cb),
        cb => writeFile(categoriesFile, JSON.stringify(categoriesInfo), cb),
        cb => writeFile(packsFile, JSON.stringify(packsInfo), cb),
        // handle copying or linking necessary assets
        cb => async.each(packs, ([path, pack]: [string, EmojiDefinition], next) => {
          const dir = join(assetsDir, pack.id);

          if (pack.mode === 'images') {
            linkDirs(join(path, pack.images.directory), dir, next);
          } else if (pack.mode === 'sprite') {
            const filename = basename(pack.sprite.file);
            async.series([
              cb => mkdirp(dir, cb),
              cb => copy(join(path, pack.sprite.file), join(dir, filename), cb),
            ], next);
          } else { // pack.mode === 'font'
            const fontFiles = [
              pack.font.eot,
              pack.font.svg,
              pack.font.woff,
              pack.font.ttf,
              pack.font.woff2,
            ].filter(Boolean);

            async.series([
              cb => mkdirp(dir, cb),
              cb => async.each(fontFiles, (file, next) => {
                const filename = basename(file);
                copy(join(path, file), join(dir, filename), next);
              }, cb),
            ], next);
          }
        }, cb),
      ], next);
    },
    (results: any, next: NodeBack) => {
      clearCache();
      next();
    },
  ], callback);
}
