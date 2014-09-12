module.exports.parseEmoji = (postContent, cb) ->
  mappingEnabled = settings.get 'killSkype'
  cb null, postContent.replace /(^|<\/code>)([^<]*|<(?!code[^>]*>))*(<code[^>]*>|$)/g, (match) ->
    emoji.parse (if mappingEnabled then execMapping(match) else match), emojiPath,
      classes: 'emoji emoji-extended img-responsive'
      attributes:
        title: (match, name, parameter) -> if parameter? then parameter else name
        alt: (match, name, parameter) -> if parameter? then parameter else match