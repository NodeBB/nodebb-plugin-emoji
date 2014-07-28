emojiPath = nconf.get('url') + '/plugins/nodebb-plugin-emoji-extended/images'

defaultConfig =
  maxCount: 8
  minChars: 0
  killSkype: 1
  completePrefix: "^|[^\\w\\d)\\]}+\\-]"
  zoom: 64

# ensure the path even if emoji-parser got installed manually on NodeBB-level
emoji.init path.dirname(module.filename) + '/emoji'

updating = false

list = emoji.emoji.sort()

updateEmoji = ->
  return if updating
  updating = true
  emoji.update (err) ->
    list = emoji.emoji.sort() if !err?
    updating = false
updateEmoji()
setInterval updateEmoji, 2100000000 # each ~24d update emotes without server-restart if new ones available

settings = new Settings 'emoji-extended', '0.3', defaultConfig, null, false, false

appGet = (app, url, mw, cb) ->
  app.get url, mw, cb
  app.get "/api#{url}", cb