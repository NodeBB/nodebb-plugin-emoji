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
      // shouldBuild: data.shouldBuild == null ||
      //   !!parseInt(data.shouldBuild, 10),
      shouldParseAscii: data.shouldParseAscii == null ||
        !!parseInt(data.shouldParseAscii, 10),
    });
  });
};
const set = (value: any, callback: NodeBack<void>) => {
  settings.set('emoji', {
    // shouldBuild: value.shouldBuild ? 1 : 0,
    shouldParseAscii: value.shouldParseAscii ? 1 : 0,
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
  settings.setOne('emoji', field, value, callback);
};

export {
  get,
  set,
  getOne,
  setOne,
};
