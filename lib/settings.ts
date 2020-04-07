const settings: {
  get(key: string): Promise<{ [key: string]: any }>;
  set(key: string, value: any): Promise<void>;
  getOne(key: string, field: string): Promise<any>;
  setOne(key: string, field: string, value: any): Promise<void>;
} = require.main.require('./src/meta').settings;

interface Settings {
  parseNative: boolean;
  parseAscii: boolean;
  customFirst: boolean;
}

const defaults: Settings = {
  parseNative: true,
  parseAscii: true,
  customFirst: false,
};

const get = async (): Promise<{ [key: string]: any }> => {
  const data = await settings.get('emoji');
  const sets: Partial<Settings> = {};

  Object.keys(defaults).forEach((key: keyof Settings) => {
    const defaultVal = defaults[key];
    const str = data[key];

    if (typeof str !== 'string') {
      sets[key] = defaultVal;
      return;
    }

    const val = JSON.parse(str);
    if (typeof val !== typeof defaultVal) {
      sets[key] = defaultVal;
      return;
    }

    sets[key] = val;
  });

  return sets;
};
const set = async (data: {
  [key: string]: any;
}) => {
  const sets: Partial<Record<keyof Settings, string>> = {};
  Object.keys(data).forEach((key: keyof Settings) => {
    sets[key] = JSON.stringify(data[key]);
  });

  await settings.set('emoji', sets);
};
const getOne = async (field: keyof Settings): Promise<any> => {
  const str = await settings.getOne('emoji', field);

  const defaultVal = defaults[field];
  let val = JSON.parse(str);
  if (typeof val !== typeof defaultVal) {
    val = defaultVal;
  }

  return val;
};
const setOne = async (field: string, value: any) => {
  await settings.setOne('emoji', field, JSON.stringify(value));
};

export {
  get,
  set,
  getOne,
  setOne,
};
