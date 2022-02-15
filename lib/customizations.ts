const db = require.main.require('./src/database');

const emojisKey = 'emoji:customizations:emojis';
const adjunctsKey = 'emoji:customizations:adjuncts';

interface SortedResult {
  value: string;
  score: number;
}
export async function getAll(): Promise<Customizations> {
  const [emojis, adjuncts]: [SortedResult[], SortedResult[]] = await Promise.all([
    db.getSortedSetRangeWithScores(emojisKey, 0, -1),
    db.getSortedSetRangeWithScores(adjunctsKey, 0, -1),
  ]);
  return {
    emojis: Object.fromEntries(emojis.map(({ value, score }) => [score, JSON.parse(value)])),
    adjuncts: Object.fromEntries(adjuncts.map(({ value, score }) => [score, JSON.parse(value)])),
  };
}

export async function add({ type, item }: { type: string, item: unknown }): Promise<string> {
  const key = type === 'emoji' ? emojisKey : adjunctsKey;
  // get maximum score from set
  const [result] = await db.getSortedSetRevRangeWithScores(key, 0, 1);
  const lastId = (result && result.score) || 1;
  const id = lastId + 1;
  await db.sortedSetAdd(key, id, JSON.stringify(item));
  return id;
}

export async function edit({ type, id, item }: {
  type: string,
  id: number,
  item: unknown,
}): Promise<void> {
  const key = type === 'emoji' ? emojisKey : adjunctsKey;
  await db.sortedSetsRemoveRangeByScore([key], id, id);
  await db.sortedSetAdd(key, id, JSON.stringify(item));
}

export async function remove({ type, id }: { type: string, id: number }): Promise<void> {
  const key = type === 'emoji' ? emojisKey : adjunctsKey;
  await db.sortedSetsRemoveRangeByScore([key], id, id);
}
