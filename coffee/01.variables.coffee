emojiPath = nconf.get('url') + '/plugins/emoji-extended-images'

defaultConfig =
  'maxCount': 8
  'minChars': 0
  'killSkype': 1

getConfig = (key) ->
  meta.config["emoji:extended:#{key}"] || defaultConfig[key]

getConfigInt = (key) ->
  parseInt getConfig key

module.exports.configDefaults = (id) ->
  if id == 'nodebb-plugin-emoji-extended'
    meta.configs.setOnEmpty key, defaultConfig[key], (->) for key of defaultConfig