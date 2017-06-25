import { access } from 'fs';
import { join } from 'path';
import { some } from 'async';

import { build } from './pubsub';

const nconf = require.main.require('nconf');
const baseDir = nconf.get('base_dir');

// build when a plugin is (de)activated if that plugin is an emoji pack
const toggle = ({ id }: { id: string }, cb: NodeBack) => {
  some([
    join(baseDir, 'node_modules', id, 'emoji.json'),
    join(baseDir, 'node_modules', id, 'emoji.js'),
  ], (path, next) => {
    access(path, (err) => {
      if (err && err.code !== 'ENOENT') {
        next(err);
      } else {
        next(null, !err);
      }
    });
  }, (err: NodeJS.ErrnoException, result: boolean) => {
    if (err) {
      cb(err);
      return;
    }

    if (!result) {
      cb();
      return;
    }

    build(cb);
  });
};

export {
  toggle as activation,
  toggle as deactivation,
};
