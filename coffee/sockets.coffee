initSockets = ->
  ModulesSockets.emojiExtended = (socket, data, cb) ->
    cb null,
      completePrefix: getConfig 'completePrefix'
      maxCount: getConfigInt 'maxCount'
      minChars: getConfigInt 'minChars'
      path: emojiPath