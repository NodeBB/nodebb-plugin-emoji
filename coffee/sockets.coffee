initSockets = ->
  SocketModules.emojiExtended = (socket, data, cb) ->
    cb null,
      settings: settings.get()
      list: list
  SocketAdmin.settings.syncEmojiExtended = -> settings.sync()

  SocketAdmin.settings.getEmojiExtendedDefaults = (socket, data, callback) ->
    callback null, settings.createDefaultWrapper()

  SocketAdmin.settings.updateEmoji = updateEmoji