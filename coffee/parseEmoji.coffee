module.exports.parseEmoji = (postContent) ->
  mappingEnabled = getConfigInt 'killSkype'
  postContent.replace /(^|<\/code>)([^<]*|<(?!code>))*(<code>|$)/g, (match) ->
    emoji (if mappingEnabled then execMapping(match) else match), emojiPath