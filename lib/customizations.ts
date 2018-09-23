const adminSockets = require.main.require('./src/socket.io/admin');
const db = require.main.require('./src/database');

const hash: (str: string) => number = require('string-hash');
import * as async from 'async';

const emojisKey = 'emoji:customizations:emojis';
const adjunctsKey = 'emoji:customizations:adjuncts';

interface SortedResult {
  value: string;
  score: number;
}
export const getCustomizations = (callback: NodeBack<Customizations>) => {
  async.waterfall([
    (next: NodeBack) => async.parallel({
      emojis: cb => db.getSortedSetRangeWithScores(emojisKey, 0, -1, cb),
      adjuncts: cb => db.getSortedSetRangeWithScores(adjunctsKey, 0, -1, cb),
    }, next),
    ({ emojis, adjuncts }: {
      emojis: SortedResult[],
      adjuncts: SortedResult[],
    }, next: NodeBack) => {
      const emojisParsed: CustomEmoji[] = emojis.map(emoji => JSON.parse(emoji.value));
      const adjunctsParsed: CustomAdjunct[] = adjuncts.map(adjunct => JSON.parse(adjunct.value));

      next(null, {
        emojis: emojisParsed,
        adjuncts: adjunctsParsed,
      });
    },
  ], callback);
};

const editThing = (key: string, name: string, thing: CustomEmoji | CustomAdjunct) => {
  async.series([
    (next) => {
      const num = hash(name);
      db.sortedSetsRemoveRangeByScore([key], num, num, next);
    },
    (next) => {
      const num = hash(thing.name);
      db.sortedSetAdd(key, num, JSON.stringify(thing), next);
    },
  ]);
};

const deleteThing = (key: string, name: string) => {
  const num = hash(name);
  db.sortedSetsRemoveRangeByScore([key], num, num);
};

const emojiSockets: any = {};

emojiSockets.getCustomizations = (
  socket: SocketIO.Socket,
  callback: NodeBack,
) => getCustomizations(callback);

emojiSockets.editEmoji = (
  socket: SocketIO.Socket,
  [name, emoji]: [string, CustomEmoji],
) => editThing(emojisKey, name, emoji);
emojiSockets.deleteEmoji = (
  socket: SocketIO.Socket,
  name: string,
) => deleteThing(emojisKey, name);

emojiSockets.editAdjunct = (
  socket: SocketIO.Socket,
  [name, adjunct]: [string, CustomAdjunct],
) => editThing(adjunctsKey, name, adjunct);
emojiSockets.deleteAdjunct = (
  socket: SocketIO.Socket,
  name: string,
) => deleteThing(adjunctsKey, name);

adminSockets.plugins.emoji = emojiSockets;
