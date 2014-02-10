mappingEnabled = getConfigInt 'killSkype'
module.exports.parseEmoji = (postContent) ->
  postContent.replace /(^|<\/code>)([^<]*|<(?!code>))*(<code>|$)/g, (match) ->
    emoji (if mappingEnabled then execMapping(match) else match), emojiPath