import { waterfall } from 'async';
import { access } from 'fs';

import * as settings from './settings';
import * as plugins from './plugins';
import * as parse from './parse';
import { tableFile } from './build';
import { build } from './pubsub';
import controllers from './controllers';
import './customizations';

const nconf = require.main.require('nconf');
const db = require.main.require('./src/database');
const buster = require.main.require('./src/meta').config['cache-buster'];

const init = (
  params: any,
  callback: NodeBack<void>,
) => {
  controllers(params);

  waterfall([
    settings.get,
    ({ parseAscii, parseNative }: {
      parseAscii: boolean,
      parseNative: boolean,
    }, next: NodeBack) => {
      // initialise ascii flag
      parse.setOptions({
        ascii: parseAscii,
        native: parseNative,
      });

      // always build on startup if in dev mode
      if (nconf.any('build_emoji', 'BUILD_EMOJI')) {
        next(null, true);
        return;
      }

      // otherwise, build if never built before
      access(tableFile, (err) => {
        if (err && err.code !== 'ENOENT') {
          return next(err);
        }

        next(null, !!err);
      });
    },
    (shouldBuild: boolean, next: NodeBack) => {
      if (shouldBuild) {
        build(next);
      } else {
        next();
      }
    },
  ], callback);
};

const adminMenu = (header: {
  plugins: { route: string, icon: string, name: string }[],
}, callback: NodeBack) => {
  header.plugins.push({
    route: '/plugins/emoji',
    icon: 'fa-smile-o',
    name: 'Emoji',
  });
  callback(null, header);
};

const composerFormatting = (data: {
  options: { name: string, className: string, title: string }[],
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
    rel: string, type?: string, href: string,
  }[],
}, callback: NodeBack) => {
  const rel = nconf.get('relative_path');

  data.links.push({
    rel: 'stylesheet',
    href: `${rel}/plugins/nodebb-plugin-emoji/emoji/styles.css?${buster}`,
  });

  callback(null, data);
};

export {
  init,
  adminMenu,
  composerFormatting,
  plugins,
  parse,
  addStylesheet,
};
