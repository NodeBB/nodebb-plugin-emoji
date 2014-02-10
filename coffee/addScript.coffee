module.exports.addScript = (scripts) ->
  encodedPath = encodeURIComponent emojiPath
  maxCount = meta.config['emoji:extended:maxCount'] || 8
  scripts.concat [
    "plugins/emoji-extended-js/jquery.textcomplete.min.js"
    "plugins/emoji-extended-js/fetchParameter.js"
    "plugins/emoji-extended-js/smiley-box.js?path=#{encodedPath}&maxCount=#{maxCount}"
  ]