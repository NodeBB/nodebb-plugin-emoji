$(window).ready ->
  window.fetchParameter = (scriptName) ->
    script = $("script[src*=\"#{scriptName}\"]")
    return [] if !script.length
    splitted = script.attr('src').replace(/^.*\?([^\?]+?)$/, '$1').split '&'
    map = {}
    for keyValue in splitted
      prop = keyValue.split '=', 2
      map[prop[0]] = decodeURIComponent prop[1]
    map