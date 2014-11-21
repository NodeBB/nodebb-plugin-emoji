BOUNDARY_BEFORE = "^|\\s|<\\/?[\\w-]+>"
BOUNDARY_AFTER = "<\\/?[\\w-]+>|\\s|$"

mapTests = {}

refreshMappings = ->
  mapTests.separatedBeforeAny = null
  mapTests.separatedBefore = []
  mapTests.separatedBoth = []

  mappings = settings.get "mapping"
  beforeAny = ""

  addBefore = (key, regexObj) ->
    options = regexObj.options + if regexObjectToRegExp(regexObj)?.global then '' else 'g'
    beforeAny += "|" if beforeAny
    beforeAny += regexObj.source
    mapTests.separatedBefore.push
      key: ":#{key}[$1]:"
      regex: new RegExp "(#{regexObj.source})", options

  addBoth = (key, regexObj) ->
    options = regexObj.options + if regexObjectToRegExp(regexObj)?.global then '' else 'g'
    mapTests.separatedBoth.push
      key: "$1:#{key}[$2]:$3"
      regex: new RegExp "(#{BOUNDARY_BEFORE})(#{regexObj.source})(#{BOUNDARY_AFTER})", options

  for key, value of mappings.separatedBefore
    if value instanceof Array
      addBefore key, val for val in value
    else
      addBefore key, value

  mapTests.separatedBeforeAny = new RegExp "(?:#{BOUNDARY_BEFORE})(#{beforeAny})", "ig"

  for key, value of mappings.separatedBoth
    if value instanceof Array
      addBoth key, val for val in value
    else
      addBoth key, value

refreshMappings()

getHandler = (tests) -> (match) ->
  for entry in tests
    m = match.replace entry.regex, entry.key
    return m if m != match
  match

execMapping = (content) ->
  content = content.replace mapTests.separatedBeforeAny, getHandler mapTests.separatedBefore
  content = content.replace entry.regex, entry.key for entry in mapTests.separatedBoth
  content