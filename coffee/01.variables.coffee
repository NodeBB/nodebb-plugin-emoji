emojiPath = nconf.get('url') + '/plugins/emoji-extended-images'

defaultConfig =
  'maxCount': 8
  'minChars': 0
  'killSkype': 1

getConfig = (key) ->
  meta.config["emoji:extended:#{key}"] || defaultConfig[key]

getConfigInt = (key) ->
  parseInt getConfig key