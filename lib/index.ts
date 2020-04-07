import { access } from 'fs-extra';

import * as settings from './settings';
import * as plugins from './plugins';
import * as parse from './parse';
import { tableFile } from './build';
import { build } from './pubsub';
import controllers from './controllers';
import './customizations';

const nconf = require.main.require('nconf');
const buster = require.main.require('./src/meta').config['cache-buster'];

const init = async (params: any): Promise<void> => {
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
};

const adminMenu = (header: {
  plugins: { route: string; icon: string; name: string }[];
}, callback: NodeBack) => {
  header.plugins.push({
    route: '/plugins/emoji',
    icon: 'fa-smile-o',
    name: 'Emoji',
  });
  callback(null, header);
};

const composerFormatting = (data: {
  options: { name: string; className: string; title: string }[];
}, callback: NodeBack) => {
  data.options.push({
    name: 'emoji-add-emoji',
    className: 'fa fa-smile-o emoji-add-emoji',
    title: '[[emoji:composer.title]]',
  });
  callback(null, data);
};

const addStylesheet = (data: {
  links: {
    rel: string; type?: string; href: string;
  }[];
}, callback: NodeBack) => {
  const rel = nconf.get('relative_path');

  data.links.push({
    rel: 'stylesheet',
    href: `${rel}/plugins/nodebb-plugin-emoji/emoji/styles.css?${buster}`,
  });

  callback(null, data);
};

const configGet = async (config: any): Promise<any> => {
  const customFirst = await settings.getOne('customFirst');
  // eslint-disable-next-line no-param-reassign
  config.emojiCustomFirst = customFirst;
  return config;
};

export {
  init,
  adminMenu,
  composerFormatting,
  plugins,
  parse,
  addStylesheet,
  configGet,
};
