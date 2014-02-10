module.exports.addScript = (scripts) ->
  encodedPath = encodeURIComponent emojiPath
  maxCount = getConfigInt 'maxCount'
  minChars = getConfigInt 'minChars'
  scripts.concat [
    "plugins/emoji-extended-js/lib/jquery.textcomplete.min.js"
    "plugins/emoji-extended-js/fetchParameter.js"
    "plugins/emoji-extended-js/smiley-box.js?path=#{encodedPath}&maxCount=#{maxCount}&minChars=#{minChars}"
  ]