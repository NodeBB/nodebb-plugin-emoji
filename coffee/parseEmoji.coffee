module.exports.parseEmoji = (postContent, cb) ->
  mappingEnabled = settings.get 'killSkype'
  cb null, postContent.replace /(^|<\/code>)([^<]*|<(?!code>))*(<code>|$)/g, (match) ->
    emoji.parse (if mappingEnabled then execMapping(match) else match), emojiPath,
      classes: 'emoji emoji-extended img-responsive'