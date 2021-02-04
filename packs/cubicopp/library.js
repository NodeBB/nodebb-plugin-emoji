const emoji = require('./emoji.json');

exports.defineEmoji = (data, callback) => {
  emoji.path = __dirname;
  data.packs.push(emoji);
  callback(null, data);
};
