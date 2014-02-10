module.exports.appLoad = ->
  ModulesSockets.emojiExtended = (socket, data, cb) ->
    cb null,
      maxCount: getConfigInt 'maxCount'
      minChars: getConfigInt 'minChars'
      path: emojiPath