initSockets = ->
  # Called by each client on document-load
  SocketModules.emojiExtended = (socket, data, cb) ->
    cb null,
      settings: settings.get()
      list: list
      version: pkg.version

  # called by admin to refresh settings
  SocketAdmin.settings.syncEmojiExtended = -> settings.sync -> refreshMappings()

  # called by admin to fetch default settings
  SocketAdmin.settings.getEmojiExtendedDefaults = (socket, data, callback) ->
    callback null, settings.createDefaultWrapper()

  # called by admin to order an update of emoji-images (fetching from
  SocketAdmin.settings.updateEmojiExtended = updateEmoji