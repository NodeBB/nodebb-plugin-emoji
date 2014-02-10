module.exports.parseEmoji = (postContent) ->
  postContent.replace /(^|<\/code>)([^<]*|<(?!code>))*(<code>|$)/g, (match) ->
    emoji execMapping(match), emojiPath