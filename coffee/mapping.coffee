mappings =
  separatedBefore:
    ':no_mouth[$1]:': /(:[-=]?#)/i
    ':stuck_out_tongue_winking_eye[$1]:': /(:[-=]?\*)/i
    ':grinning[$1]:': /(:[-=]?\))/
    ':frowning[$1]:': /(:[-=]?\()/
    ':sunglasses[$1]:': /([8b][-=]?[\|\)])/i
    ':wink[$1]:': /(;[-=]?\))/
    ':relieved[$1]:': /(;[-=]?\()/
    ':expressionless[$1]:': /(:[-=]?\|)/
    ':blush[$1]:': /(:[-=]?\$|:&quot>)/
    ':smirk[$1]:': /(:\^\))/
    ':sleeping[$1]:': /([\|i][-=]?\))/
    ':pensive[$1]:': /(\|[-=]?\()/
    ':mask[$1]:': /(:[-=]?&amp;)/
    ':trollface[$1]:': /(;\/\))/
    ':rage[$1]:': /(:[-=]?@)/
    ':rage[$1]:': /(x[-=]?\()/i
    ':confused[$1]:': /(:[-=]?\?)/
    ':question[$1]:': /(\?\?\?)/
  separatedBoth: [
    [ ':heart[$1]:', /(&lt;3)/ ]
    [ ':laughing[$1]:', /(x[-=]?d)/i ]
    [ ':zzz[$1]:', /(zzz)/i ]
    [ ':eyes[$1]:', /(o_o)/i ]
    [ ':smiley[$1]:', /(:[-=]?d)/i ]
    [ ':hushed[$1]:', /(:[-=]?o)/i ]
    [ ':stuck_out_tongue_winking_eye[$1]:', /(:[-=]?p)/i ]
    [ ':confounded[$1]:', /(:[-=]?s)/i ]
    [ ':no_mouth[$1]:', /(:[-=]?x)/i ]
  ]

mapTests =
  separatedBefore: /(^|\s|<\/?[\w-]+>)(:[=-]?[\(\)\|\*\$@#\?]|:[=-]?&amp;|;[=-]?[\(\)]|[8b][=-]?[\)\|]|[\|i][-=]?[\(\)]|x[-=]?[\(\)]|:&quot;>|:\^\)|;\/\)|\?{3})/ig
  separatedBoth: []

for arr in mappings.separatedBoth
  mapTests.separatedBoth.push new RegExp "(?:^|\\s|<\\/?[\\w-]+>)(#{arr[1].source})(?:<\\/?[\\w-]+>|\\s|$)", 'ig'

getHandler = (mapping) -> (match) ->
  for replacement, regex of mapping
    m = match.replace regex, replacement
    return m if m != match
  match

execMapping = (content) ->
  content = content.replace mapTests.separatedBefore, getHandler mappings.separatedBefore
  for regex, i in mapTests.separatedBoth
    arr = mappings.separatedBoth[i]
    content = content.replace regex, (match) -> match.replace arr[1], arr[0]
  content