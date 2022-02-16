import { join, resolve, basename } from 'path';
import {
  mkdirp,
  copy,
  remove,
  writeFile,
  symlink,
} from 'fs-extra';
import { uniq } from 'lodash';

import * as cssBuilders from './css-builders';
import { getBaseUrl } from './base-url';
import { clearCache } from './parse';
import { getAll as getCustomizations } from './customizations';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const plugins = require.main.require('./src/plugins');

export const assetsDir = join(__dirname, '../emoji');

const linkDirs = (sourceDir: string, destDir: string) => {
  const type = (process.platform === 'win32') ? 'junction' : 'dir';
  return symlink(sourceDir, destDir, type);
};

export const tableFile = join(assetsDir, 'table.json');
export const aliasesFile = join(assetsDir, 'aliases.json');
export const asciiFile = join(assetsDir, 'ascii.json');
export const charactersFile = join(assetsDir, 'characters.json');
export const categoriesFile = join(assetsDir, 'categories.json');
export const packsFile = join(assetsDir, 'packs.json');

export default async function build(): Promise<void> {
  winston.verbose('[emoji] Building emoji assets');

  // fetch the emoji definitions
  const { packs }: { packs: EmojiDefinition[] } = await plugins.hooks.fire('filter:emoji.packs', { packs: [] });
  // filter out invalid ones
  const filtered = packs.filter((pack) => {
    if (pack && pack.id && pack.name && pack.mode && pack.dictionary && pack.path) {
      return true;
    }

    winston.warn('[emoji] pack invalid: ', pack.path || pack.id);
    return false;
  });

  winston.verbose(`[emoji] Loaded packs: ${filtered.map(pack => pack.id).join(', ')}`);

  await remove(assetsDir);
  await mkdirp(assetsDir);

  const customizations = await getCustomizations();

  const table: MetaData.Table = {};
  const aliases: MetaData.Aliases = {};
  const ascii: MetaData.Ascii = {};
  const characters: MetaData.Characters = {};

  const categoriesInfo: MetaData.Categories = {};
  const packsInfo: MetaData.Packs = [];

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

  Object.values(customizations.emojis).forEach((emoji) => {
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
  Object.values(customizations.adjuncts).forEach((adjunct) => {
    const name = adjunct.name;
    if (!table[name]) { return; }

    table[name] = {
      ...table[name],
      aliases: table[name].aliases.concat(adjunct.aliases),
    };

    adjunct.aliases.forEach((alias) => { aliases[alias] = name; });
    adjunct.ascii.forEach((str) => { ascii[str] = name; });
  });

  // generate CSS styles
  cssBuilders.setBaseUrl(getBaseUrl());
  const css = packs.map(pack => cssBuilders[pack.mode](pack)).join('\n');
  const cssFile = `${css}\n.emoji-customizations {
    display: inline-block;
    height: 23px;
    margin-top: -1px;
    margin-bottom: -1px;
  }`.split('\n').map(x => x.trim()).join('');

  // handling copying or linking necessary assets
  const assetOperations = packs.map(async (pack) => {
    const dir = join(assetsDir, pack.id);

    if (pack.mode === 'images') {
      await linkDirs(resolve(pack.path, pack.images.directory), dir);
    } else if (pack.mode === 'sprite') {
      const filename = basename(pack.sprite.file);
      await mkdirp(dir);
      await copy(resolve(pack.path, pack.sprite.file), join(dir, filename));
    } else { // pack.mode === 'font'
      const fontFiles = [
        pack.font.eot,
        pack.font.svg,
        pack.font.woff,
        pack.font.ttf,
        pack.font.woff2,
      ].filter(Boolean);

      await mkdirp(dir);
      await Promise.all(fontFiles.map(async (file) => {
        const filename = basename(file);
        copy(resolve(pack.path, file), join(dir, filename));
      }));
    }
  });

  await Promise.all([
    ...assetOperations,
    // store CSS styles
    writeFile(join(assetsDir, 'styles.css'), cssFile, { encoding: 'utf8' }),
    // persist metadata to disk
    writeFile(tableFile, JSON.stringify(table)),
    writeFile(aliasesFile, JSON.stringify(aliases)),
    writeFile(asciiFile, JSON.stringify(ascii)),
    writeFile(charactersFile, JSON.stringify(characters)),
    writeFile(categoriesFile, JSON.stringify(categoriesInfo)),
    writeFile(packsFile, JSON.stringify(packsInfo)),
    // link customizations to public/uploads/emoji
    linkDirs(
      join(nconf.get('upload_path'), 'emoji'),
      join(assetsDir, 'customizations')
    ),
  ]);

  clearCache();
}
