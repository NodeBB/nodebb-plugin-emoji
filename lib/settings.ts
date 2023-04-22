const settings: {
  get(key: string): Promise<{ [key: string]: unknown } | null>;
  set(key: string, value: unknown): Promise<void>;
  getOne(key: string, field: string): Promise<unknown>;
  setOne(key: string, field: string, value: unknown): Promise<void>;
} = require.main.require('./src/meta').settings;

const defaults: Settings = {
  parseNative: true,
  parseAscii: true,
  customFirst: false,
  parseTitles: false,
};

function fromStore<
  K extends keyof Settings
>(key: K, x: unknown): Settings[K] {
  if (typeof x === typeof defaults[key]) {
    return x as Settings[K];
  }
  if (typeof x === 'string') {
    try {
      return JSON.parse(x) ?? defaults[key];
    } catch {
      return defaults[key];
    }
  }
  return defaults[key];
}

export async function get(): Promise<Settings> {
  const data = await settings.get('emoji');

  return {
    parseNative: fromStore('parseNative', data?.parseNative),
    parseAscii: fromStore('parseAscii', data?.parseAscii),
    customFirst: fromStore('customFirst', data?.customFirst),
    parseTitles: fromStore('parseTitles', data?.parseTitles),
  };
}
export async function set(data: Settings): Promise<void> {
  await settings.set('emoji', {
    parseNative: JSON.stringify(data.parseNative),
    parseAscii: JSON.stringify(data.parseAscii),
    customFirst: JSON.stringify(data.customFirst),
    parseTitles: JSON.stringify(data.parseTitles),
  });
}
export async function getOne<K extends keyof Settings>(field: K): Promise<Settings[K]> {
  const val = await settings.getOne('emoji', field);
  return fromStore(field, val);
}
export async function setOne<
  K extends keyof Settings
>(field: K, value: Settings[K]): Promise<void> {
  await settings.setOne('emoji', field, JSON.stringify(value));
}
