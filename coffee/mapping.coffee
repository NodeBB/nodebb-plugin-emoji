mapping = [
  /:[-=]?s/i, ':confounded:'
  /:[-=]?d/i, ':laughing:'
  /:[-=]?o/i, ':hushed:'
  /:[-=]?[x#]/i, ':no_mouth:'
  /:[-=]?[\*p]/i, ':stuck_out_tongue_winking_eye:'
  /:[-=]?\)/, ':grinning:'
  /:[-=]?\(/, ':frowning:'
  /[8b][-=]?[\|\)]/i, ':sunglasses:'
  /;[-=]?\)/, ':wink:'
  /;[-=]?\(/, ':relieved:'
  /:[-=]?\|/, ':expressionless:'
  /:[-=]?\$|:&quot>/, ':blush:'
  /:\^\)/, ':smirk:'
  /[\|i][-=]?\)/, ':sleeping:'
  /\|[-=]?\(/, ':pensive:'
  /:[-=]?&amp;/, ':mask:'
  /;\/\)/, ':trollface:'
  /:[-=]?@/, ':rage:'
  /x[-=]?\(/i, ':rage:'
  /:[-=]?\?/, ':confused:'
  /\?\?\?/, ':question:'
  /&lt;3/, ':heart:'
  /zzz/i, ':zzz:'
  /o_o/i, ':eyes:'
]
mapTest = /(^|\s|<\/?[\w-]+>)(:[=-]?[\(\)\|\*\$@#\?]|:[=-]?&amp;|;[=-]?[\(\)]|[8b][=-]?[\)\|]|[\|i][-=]?[\(\)]|x[-=]?[\(\)]|:&quot;>|:\^\)|;\/\)|\?{3}|z{3}|o_o)|(^|\s|<(br|p)>)(&lt;3)(<\/?\w+>|\s|$)|(:[=-]?[dopsx])(<\/?[\w-]+>|\s|$)/ig

execMapping = (content) ->
  content.replace mapTest, (match) ->
    for ignored in mapping
      m = match.replace mapping[_i], mapping[++_i]
      return m if m != match
    match