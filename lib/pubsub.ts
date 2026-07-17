import * as os from 'os';

import buildAssets from './build';

const nconf = nodebb.require('nconf');
const winston = nodebb.require('winston');
const pubsub = nodebb.require('./src/pubsub');

const primary = nconf.get('isPrimary') === 'true' || nconf.get('isPrimary') === true;
const hostname = os.hostname();

if (primary) {
  pubsub.on('emoji:build', (data: { hostname: string }) => {
    if (data.hostname !== hostname) {
      buildAssets().catch((err) => {
        winston.error(err);
      });
    }
  });
}

export async function build(): Promise<void> {
  await buildAssets();

  pubsub.publish('emoji:build', {
    hostname,
  });
}
