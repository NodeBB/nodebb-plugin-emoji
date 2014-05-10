emojiPath = nconf.get('url') + '/plugins/nodebb-plugin-emoji-extended/images'

defaultConfig =
  maxCount: 8
  minChars: 0
  killSkype: 1
  completePrefix: "^|[^\\w\\d)\\]}+\\-]"
  zoom: 64

settings = new Settings 'emoji-extended', '0.2.4-1', defaultConfig, null, false, false

appGet = (app, url, mw, cb) ->
  app.get url, mw, cb
  app.get "/api#{url}", cb