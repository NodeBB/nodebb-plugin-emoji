emojiPath = nconf.get('url') + '/plugins/nodebb-plugin-emoji-extended/images'

regexObject = (regex) ->
  parts = /^\/(.*)\/([^\/]*)$/.exec regex.toString()
  res =
    source: parts?[1]
    options: parts?[2]
  res.source = '' if !res.source?
  res.options = '' if !res.options?
  res

regexObjectToRegExp = (regexObject) -> new RegExp regexObject.source || '', regexObject.options || ''

defaultConfig =
  completion:
    maxLines: 8
    minChars: 0
    prefix: "^|[^\\w\\)\\]\\}\\-+]"
  fileSystemAccess: 1 # allows write-access for emoji-images like image-updates
  mapping:
    enabled: 1
    separatedBefore:
      no_mouth: regexObject /:[-=]?#/i
      cry: regexObject /:[-=]?[\*']\(/i
      grinning: regexObject /:[-=]?\)/
      frowning: regexObject /:[-=]?\(/
      sunglasses: regexObject /[8b][-=]?[\|\)]/i
      wink: regexObject /;[-=]?\)/
      relieved: regexObject /;[-=]?\(/
      expressionless: regexObject /:[-=]?\|/
      blush: regexObject /:[-=]?\$|:&quot;/
      smirk: regexObject /:\^\)/
      sleeping: regexObject /[\|i][-=]?\)/
      pensive: regexObject /\|[-=]?\(/
      mask: regexObject /:[-=]?&amp;/
      trollface: regexObject /;\/\)/
      rage: [regexObject(/:[-=]?@/), regexObject(/x[-=]?\(/i)]
      confused: regexObject /:[-=]?\?/
      question: regexObject /\?\?\?/
      exclamation: regexObject /!!!/
    separatedBoth:
      heart: regexObject /&lt;3/
      broken_heart: regexObject /&lt;[\/\\\|!]3/
      laughing: regexObject /x[-=]?d/i
      zzz: regexObject /zzz/i
      eyes: regexObject /o_o/i
      smiley: regexObject /:[-=]?d/i
      hushed: regexObject /:[-=]?o/i
      stuck_out_tongue_winking_eye: regexObject /:[-=]?p/i
      confounded: regexObject /:[-=]?s/i
      no_mouth: regexObject /:[-=]?x/i
  zoom: 48

replaceRegex = /(^|<\/code>)([^<]*|<(?!code[^>]*>))*(<code[^>]*>|$)/g

# ensure the path even if emoji-parser got installed manually on NodeBB-level
emoji.init path.dirname(module.filename) + '/emoji'

list = emoji.emoji.sort()

updating = false
updateEmoji = ->
  return if updating || !settings.fileSystemAccess
  updating = true
  emoji.update (err) ->
    list = emoji.emoji.sort() if !err?
    updating = false

settings = new Settings 'emoji-extended', '0.4.1-4', defaultConfig, null, false, false

getRoute = (router, url, mw, cb) ->