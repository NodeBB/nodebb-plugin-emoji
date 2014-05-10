initSockets = ->
  SocketModules.emojiExtended = (socket, data, cb) ->
    cb null, settings.get()
  SocketAdmin.settings.syncEmojiExtended = -> settings.sync()

  SocketAdmin.settings.getEmojiExtendedDefaults = (socket, data, callback) ->
    callback null, settings.createDefaultWrapper()