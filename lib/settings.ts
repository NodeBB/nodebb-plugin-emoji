const settings: {
  get(key: string, cb: NodeBack<{ [key: string]: any }>): void,
  set(key: string, value: any, cb: NodeBack<void>): void,
  getOne(key: string, field: string, cb: NodeBack<any>): void,
  setOne(key: string, field: string, value: any, cb: NodeBack<void>): void,
} = require.main.require('./src/meta').settings;

const get = (callback: NodeBack<{ [key: string]: any }>) => {
  settings.get('emoji', (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    callback(null, {
      parseNative: data.parseNative == null ||
        !!parseInt(data.parseNative, 10),
      parseAscii: data.parseAscii == null ||
        !!parseInt(data.parseAscii, 10),
    });
  });
};
const set = (value: any, callback: NodeBack<void>) => {
  settings.set('emoji', {
    parseNative: value.parseNative ? 1 : 0,
    parseAscii: value.parseAscii ? 1 : 0,
  }, callback);
};
const getOne = (field: string, callback: NodeBack<any>) => {
  settings.getOne('emoji', field, (err, val) => {
    if (err) {
      callback(err);
      return;
    }

    callback(null, val == null || !!parseInt(val, 10));
  });
};
const setOne = (field: string, value: any, callback: NodeBack<void>) => {
  settings.setOne('emoji', field, value ? 1 : 0, callback);
};

export {
  get,
  set,
  getOne,
  setOne,
};
