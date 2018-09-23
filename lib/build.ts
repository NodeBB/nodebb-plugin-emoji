import { writeFile, symlink } from 'fs';
import { join, resolve, basename } from 'path';
import { mkdirp, copy, remove } from 'fs-extra';
import { uniq } from 'lodash';
import * as async from 'async';

import * as cssBuilders from './css-builders';
import { clearCache } from './parse';
import { setOne as setSetting } from './settings';
import { getCustomizations } from './customizations';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const db = require.main.require('./src/database');
const plugins = require.main.require('./src/plugins');

export const assetsDir = join(__dirname, '../emoji');

const linkDirs = (sourceDir: string, destDir: string, callback: NodeBack) => {
  const type = (process.platform === 'win32') ? 'junction' : 'dir';
  symlink(sourceDir, destDir, type, callback);
};

export const tableFile = join(assetsDir, 'table.json');
export const aliasesFile = join(assetsDir, 'aliases.json');
export const asciiFile = join(assetsDir, 'ascii.json');
export const charactersFile = join(assetsDir, 'characters.json');
export const categoriesFile = join(assetsDir, 'categories.json');
export const packsFile = join(assetsDir, 'packs.json');

export default function build(callback: NodeBack) {
  winston.verbose('[emoji] Building emoji assets');

  async.waterfall([
    // fetch the emoji definitions
    (next: NodeBack) => plugins.fireHook('filter:emoji.packs', { packs: [] }, next),
    // filter out invalid ones
    ({ packs }: { packs: EmojiDefinition[] }, next: NodeBack) => {
      const filtered = packs.filter((pack) => {
        if (pack && pack.id && pack.name && pack.mode && pack.dictionary && pack.path) {
          return true;
        }

        winston.warn('[emoji] pack invalid', pack.path || pack.id);
        return false;
      });

      winston.verbose('[emoji] Loaded packs', filtered.map(pack => pack.id).join(', '));

      async.series([
        cb => remove(assetsDir, cb),
        cb => mkdirp(assetsDir, cb),
      ], (err: Error) => next(err, filtered));
    },
    (packs: EmojiDefinition[], next: NodeBack) => {
      getCustomizations((err, custs) => next(err, packs, custs));
    },
    (packs: EmojiDefinition[], customizations: Customizations, next: NodeBack) => {
      const table: MetaData.table = {};
      const aliases: MetaData.aliases = {};
      const ascii: MetaData.ascii = {};
      const characters: MetaData.characters = {};

      const categoriesInfo: MetaData.categories = {};
      const packsInfo: MetaData.packs = [];

      packs.forEach((pack) => {
        packsInfo.push({
          name: pack.name,
          id: pack.id,
          attribution: pack.attribution,
          license: pack.license,
        });

        Object.keys(pack.dictionary).forEach((key) => {
          const name = key.toLowerCase();
          const emoji = pack.dictionary[key];

          if (!table[name]) {
            table[name] = {
              name,
              character: emoji.character || `:${name}:`,
              image: emoji.image || '',
              pack: pack.id,
              aliases: emoji.aliases || [],
              keywords: emoji.keywords || [],
            };
          }

          if (!characters[emoji.character]) {
            characters[emoji.character] = name;
          }

          if (emoji.aliases) {
            emoji.aliases.forEach((alias) => {
              const a = alias.toLowerCase();
              if (!aliases[a]) {
                aliases[a] = name;
              }
            });
          }

          if (emoji.ascii) {
            emoji.ascii.forEach((str) => {
              if (!ascii[str]) {
                ascii[str] = name;
              }
            });
          }

          const categories = emoji.categories || ['other'];
          categories.forEach((category) => {
            categoriesInfo[category] = categoriesInfo[category] || [];
            categoriesInfo[category].push(name);
          });
        });
      });

      Object.keys(categoriesInfo).forEach((category) => {
        categoriesInfo[category] = uniq(categoriesInfo[category]);
      });

      customizations.emojis.forEach((emoji) => {
        const name = emoji.name.toLowerCase();

        table[name] = {
          name,
          character: `:${name}:`,
          pack: 'customizations',
          keywords: [],
          image: emoji.image,
          aliases: emoji.aliases,
        };

        emoji.aliases.forEach((alias) => {
          const a = alias.toLowerCase();
          if (!aliases[a]) {
            aliases[a] = name;
          }
        });

        emoji.ascii.forEach((str) => {
          if (!ascii[str]) {
            ascii[str] = name;
          }
        });

        categoriesInfo.custom = categoriesInfo.custom || [];
        categoriesInfo.custom.push(name);
      });
      customizations.adjuncts.forEach((adjunct) => {
        const name = adjunct.name;
        if (!table[name]) { return; }

        table[name] = {
          ...table[name],
          aliases: table[name].aliases.concat(adjunct.aliases),
        };

        adjunct.aliases.forEach(alias => aliases[alias] = name);
        adjunct.ascii.forEach(str => ascii[str] = name);
      });

      async.parallel([
        // generate CSS styles and store them
        (cb) => {
          const css = packs.map(pack => cssBuilders[pack.mode](pack)).join('\n');
          writeFile(
            join(assetsDir, 'styles.css'),
            `${css}\n.emoji-customizations {
              display: inline-block;
              height: 23px;
              margin-top: -1px;
              margin-bottom: -1px;
            }`.split('\n').map(x => x.trim()).join(''),
            { encoding: 'utf8' },
            cb,
          );
        },
        // persist metadata to disk
        cb => writeFile(tableFile, JSON.stringify(table), cb),
        cb => writeFile(aliasesFile, JSON.stringify(aliases), cb),
        cb => writeFile(asciiFile, JSON.stringify(ascii), cb),
        cb => writeFile(charactersFile, JSON.stringify(characters), cb),
        cb => writeFile(categoriesFile, JSON.stringify(categoriesInfo), cb),
        cb => writeFile(packsFile, JSON.stringify(packsInfo), cb),
        // handle copying or linking necessary assets
        cb => async.each(packs, (pack, next) => {
          const dir = join(assetsDir, pack.id);

          if (pack.mode === 'images') {
            linkDirs(resolve(pack.path, pack.images.directory), dir, next);
          } else if (pack.mode === 'sprite') {
            const filename = basename(pack.sprite.file);
            async.series([
              cb => mkdirp(dir, cb),
              cb => copy(resolve(pack.path, pack.sprite.file), join(dir, filename), cb),
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
                copy(resolve(pack.path, file), join(dir, filename), next);
              }, cb),
            ], next);
          }
        }, cb),
        // link customizations to public/uploads/emoji
        cb => linkDirs(
          join(nconf.get('upload_path'), 'emoji'),
          join(assetsDir, 'customizations'),
          cb,
        ),
      ], next);
    },
    (results: any, next: NodeBack) => {
      clearCache();
      next();
    },
  ], callback);
}
