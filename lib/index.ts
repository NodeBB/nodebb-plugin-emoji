import { access } from 'fs-extra';

import * as settings from './settings';
import * as parse from './parse';
import { tableFile } from './build';
import { build } from './pubsub';
import controllers from './controllers';

const nconf = require.main.require('nconf');
const buster = require.main.require('./src/meta').config['cache-buster'];

export async function init(params: any): Promise<void> {
  controllers(params);

  const sets = await settings.get();
  const { parseAscii, parseNative } = sets as {
    parseAscii: boolean;
    parseNative: boolean;
  };

  // initialize parser flags
  parse.setOptions({
    ascii: parseAscii,
    native: parseNative,
  });

  // always build on startup if in dev mode
  const shouldBuild = nconf.any('build_emoji', 'BUILD_EMOJI') ||
  // otherwise, build if never built before
  access(tableFile).catch((err) => {
    if (err && err.code !== 'ENOENT') {
      throw err;
    }
    return false;
  });

  if (shouldBuild) {
    await build();
  }
}

export async function adminMenu<Payload extends {
  plugins: { route: string; icon: string; name: string }[];
}>(header: Payload): Promise<Payload> {
  header.plugins.push({
    route: '/plugins/emoji',
    icon: 'fa-smile-o',
    name: 'Emoji',
  });
  return header;
}

export async function composerFormatting<Payload extends {
  options: { name: string; className: string; title: string }[];
}>(data: Payload): Promise<Payload> {
  data.options.push({
    name: 'emoji-add-emoji',
    className: 'fa fa-smile-o emoji-add-emoji',
    title: '[[emoji:composer.title]]',
  });
  return data;
}

export async function addStylesheet<Payload extends {
  links: {
    rel: string; type?: string; href: string;
  }[];
}>(data: Payload): Promise<Payload> {
  const rel = nconf.get('relative_path');

  data.links.push({
    rel: 'stylesheet',
    href: `${rel}/plugins/nodebb-plugin-emoji/emoji/styles.css?${buster}`,
  });

  return data;
}

export async function configGet(config: any): Promise<any> {
  const customFirst = await settings.getOne('customFirst');
  // eslint-disable-next-line no-param-reassign
  config.emojiCustomFirst = customFirst;
  return config;
}

export {
  parse,
};
