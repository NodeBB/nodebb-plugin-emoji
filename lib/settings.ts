const settings: {
  get(key: string, cb: NodeBack<{ [key: string]: any }>): void,
  set(key: string, value: any, cb: NodeBack<void>): void,
  getOne(key: string, field: string, cb: NodeBack<any>): void,
  setOne(key: string, field: string, value: any, cb: NodeBack<void>): void,
} = require.main.require('./src/meta').settings;

interface Settings {
  parseNative: boolean;
  parseAscii: boolean;
}

const defaults: Settings = {
  parseNative: true,
  parseAscii: true,
};

const get = (callback: NodeBack<{ [key: string]: any }>) => {
  settings.get('emoji', (err, data) => {
    if (err) {
      callback(err);
      return;
    }

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

    callback(null, sets);
  });
};
const set = (data: {
  [key: string]: any,
}, callback: NodeBack<void>) => {
  const sets: Partial<Record<keyof Settings, string>> = {};
  Object.keys(data).forEach((key: keyof Settings) => {
    sets[key] = JSON.stringify(data[key]);
  });

  settings.set('emoji', sets, callback);
};
const getOne = (field: string, callback: NodeBack<any>) => {
  settings.getOne('emoji', field, (err, val) => {
    if (err) {
      callback(err);
      return;
    }

    callback(null, JSON.parse(val));
  });
};
const setOne = (field: string, value: any, callback: NodeBack<void>) => {
  settings.setOne('emoji', field, JSON.stringify(value), callback);
};

export {
  get,
  set,
  getOne,
  setOne,
};
