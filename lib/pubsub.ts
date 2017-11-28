import { hostname } from 'os';

import buildAssets from './build';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const pubsub = require.main.require('./src/pubsub');

const primary = nconf.get('isPrimary') === 'true' || nconf.get('isPrimary') === true;

export function build(callback: NodeBack) {
  if (pubsub.pubClient) {
    pubsub.publish('emoji:build', {
      hostname: hostname(),
    });
  }

  if (primary) {
    buildAssets(callback);
  } else {
    callback();
  }
}

const logErrors = (err: Error) => {
  if (err) {
    winston.error(err);
  }
};

if (primary) {
  pubsub.on('emoji:build', (data: { hostname: string }) => {
    if (data.hostname !== hostname()) {
      buildAssets(logErrors);
    }
  });
}
