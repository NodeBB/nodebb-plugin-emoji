module.exports.parseEmoji = (data, cb) ->
  mappingEnabled = settings.get 'killSkype'
  if data?.postData?.content?
    data.postData.content = data.postData.content.replace replaceRegex, (match) ->
      emoji.parse (if mappingEnabled then execMapping(match) else match), emojiPath,
        classes: 'emoji emoji-extended img-responsive'
        attributes:
          title: (match, name, parameter) -> if parameter? then parameter else name
          alt: (match, name, parameter) -> if parameter? then parameter else match
  cb null, data