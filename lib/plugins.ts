import { readFile } from 'fs-extra';
import { join } from 'path';

import { build } from './pubsub';

const nconf = require.main.require('nconf');
const baseDir = nconf.get('base_dir');

// build when a plugin is (de)activated if that plugin is an emoji pack
const toggle = async ({ id }: { id: string }) => {
  let file;
  try {
    file = await readFile(join(baseDir, 'node_modules', id, 'plugin.json'), 'utf8');
  } catch (err) {
    if (err && err.code !== 'ENOENT') {
      throw err;
    }
    return;
  }

  const plugin = JSON.parse(file);

  const hasHook = plugin.hooks && plugin.hooks
    .some((hook: { hook: string }) => hook.hook === 'filter:emoji.packs');

  if (hasHook) {
    await build();
  }
};

export {
  toggle as activation,
  toggle as deactivation,
};
