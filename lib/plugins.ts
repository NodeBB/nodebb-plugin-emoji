import { readFile } from 'fs';
import { join } from 'path';
import { some } from 'async';

import { build } from './pubsub';

const nconf = require.main.require('nconf');
const baseDir = nconf.get('base_dir');

const noop = () => {};

// build when a plugin is (de)activated if that plugin is an emoji pack
const toggle = ({ id }: { id: string }, cb: NodeBack = noop) => {
  readFile(
    join(baseDir, 'node_modules', id, 'plugin.json'), 
    'utf8', 
    (err, file) => {
      if (err && err.code !== 'ENOENT') {
        cb(err);
        return;
      }

      if (err || !file) {
        cb();
        return;
      }

      let plugin;
      try {
        plugin = JSON.parse(file);
      } catch (e) {
        cb(e);
        return;
      }

      const hasHook = plugin.hooks && plugin.hooks
        .some((hook: { hook: string }) => hook.hook === 'filter:emoji.packs');

      if (hasHook) {
        build(cb);
      }
    },
  );
};

export {
  toggle as activation,
  toggle as deactivation,
};
