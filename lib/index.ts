import * as settings from './settings';
import * as parse from './parse';
import { tableFile } from './build';
import { build } from './pubsub';
import controllers from './controllers';
import { getBaseUrl } from './base-url';

const nconf = require.main.require('nconf');
const buster = require.main.require('./src/meta').config['cache-buster'];
const file = require.main.require('./src/file');

export async function init(params: any): Promise<void> {
  controllers(params);

  const { parseAscii, parseNative, parseTitles } = await settings.get();

  const baseUrl = getBaseUrl();
  // initialize parser flags
  parse.setOptions({
    ascii: parseAscii,
    native: parseNative,
    titles: parseTitles,
    baseUrl,
  });

  // always build on startup if in dev mode
  const shouldBuild = nconf.any('build_emoji', 'BUILD_EMOJI') ||
    // otherwise, build if never built before
    !(await file.exists(tableFile));

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
  const baseUrl = getBaseUrl();
  data.links.push({
    rel: 'stylesheet',
    href: `${baseUrl}/plugins/nodebb-plugin-emoji/emoji/styles.css?${buster}`,
  });

  return data;
}

export async function filterMessagingLoadRoom<Payload extends {
  room: {
    composerActions: {
      action: string;
      class: string;
      icon: string;
      title: string;
    }[];
  };
}>(data: Payload): Promise<Payload> {
  if (data && data.room && Array.isArray(data.room.composerActions)) {
    data.room.composerActions.push({
      action: 'emoji',
      class: 'd-none d-md-flex',
      icon: 'fa-smile',
      title: '[[emoji:composer.title]]',
    });
  }
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
