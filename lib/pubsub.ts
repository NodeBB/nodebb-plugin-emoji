import { hostname } from 'os';

import buildAssets from './build';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const pubsub = require.main.require('./src/pubsub');

export function build(callback: NodeBack) {
  if (pubsub.pubClient) {
    pubsub.publish('emoji:build', {
      hostname: hostname(),
    });
  }

  buildAssets(callback);
}

const logErrors = (err: Error) => {
  if (err) {
    winston.error(err);
  }
};

if (nconf.get('isPrimary') === 'true') {
  pubsub.on('emoji:build', (data: { hostname: string }) => {
    if (data.hostname !== hostname()) {
      buildAssets(logErrors);
    }
  });
}
