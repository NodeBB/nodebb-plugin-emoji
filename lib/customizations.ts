import hash from 'string-hash';

const adminSockets = require.main.require('./src/socket.io/admin');
const db = require.main.require('./src/database');

const emojisKey = 'emoji:customizations:emojis';
const adjunctsKey = 'emoji:customizations:adjuncts';

interface SortedResult {
  value: string;
  score: number;
}
export const getCustomizations = async (): Promise<Customizations> => {
  const [emojis, adjuncts]: [SortedResult[], SortedResult[]] = await Promise.all([
    db.getSortedSetRangeWithScores(emojisKey, 0, -1),
    db.getSortedSetRangeWithScores(adjunctsKey, 0, -1),
  ]);

  const emojisParsed: CustomEmoji[] = emojis.map(emoji => JSON.parse(emoji.value));
  const adjunctsParsed: CustomAdjunct[] = adjuncts.map(adjunct => JSON.parse(adjunct.value));

  return {
    emojis: emojisParsed,
    adjuncts: adjunctsParsed,
  };
};

const editThing = async (key: string, name: string, thing: CustomEmoji | CustomAdjunct) => {
  const num = hash(name);
  await db.sortedSetsRemoveRangeByScore([key], num, num);

  const thingNum = hash(thing.name);
  await db.sortedSetAdd(key, thingNum, JSON.stringify(thing));
};

const deleteThing = async (key: string, name: string) => {
  const num = hash(name);
  await db.sortedSetsRemoveRangeByScore([key], num, num);
};

const emojiSockets = {
  getCustomizations,
  editEmoji: async (
    socket: SocketIO.Socket,
    [name, emoji]: [string, CustomEmoji]
  ) => editThing(emojisKey, name, emoji),
  deleteEmoji: async (
    socket: SocketIO.Socket,
    name: string
  ) => deleteThing(emojisKey, name),
  editAdjunct: async (
    socket: SocketIO.Socket,
    [name, adjunct]: [string, CustomAdjunct]
  ) => editThing(adjunctsKey, name, adjunct),
  deleteAdjunct: async (
    socket: SocketIO.Socket,
    name: string
  ) => deleteThing(adjunctsKey, name),
};

adminSockets.plugins.emoji = emojiSockets;
