(->
  parse = (content) ->
    mappingEnabled = settings.get 'killSkype'
    content.replace replaceRegex, (match) ->
      emoji.parse (if mappingEnabled then execMapping(match) else match), emojiPath,
        classes: 'emoji emoji-extended img-responsive'
        attributes:
          title: (match, name, parameter) -> if parameter? then parameter else name
          alt: (match, name, parameter) -> if parameter? then parameter else match

  module.exports.parseEmoji = (content, cb) ->
    cb null, parse content

  module.exports.parsePost = (data, cb) ->
    data.postData.content = parse data.postData.content if data?.postData?.content?
    cb null, data

#
)()