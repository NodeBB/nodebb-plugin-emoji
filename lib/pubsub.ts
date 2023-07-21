import * as os from 'os';

import buildAssets from './build';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const pubsub = require.main.require('./src/pubsub');

const primary = nconf.get('isPrimary') === 'true' || nconf.get('isPrimary') === true;
const hostname = os.hostname();
const port = nconf.get('port');
const id = `${hostname}:${port}`;

if (primary) {
  pubsub.on('emoji:build', (data: { id: string }) => {
    if (data.id !== id) {
      buildAssets().catch((err) => {
        if (err) {
          winston.error(err);
        }
      });
    }
  });
}

export async function build(): Promise<void> {
  if (pubsub.pubClient) {
    pubsub.publish('emoji:build', {
      id,
    });
  }

  if (primary) {
    await buildAssets();
  }
}
