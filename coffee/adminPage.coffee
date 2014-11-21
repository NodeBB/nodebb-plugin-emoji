constants = Object.freeze
  'name': "Emoji Extended"
  'admin':
    'route': '/plugins/emoji-extended'
    'icon': 'fa-smile-o'

initAdminRoute = (router, middleware) ->
  router.get "/admin" + constants.admin.route, middleware.admin.buildHeader, (req, res, ignored) ->
    res.render 'admin' + constants.admin.route, {}
  router.get "/api/admin" + constants.admin.route, (req, res, ignored) ->
    res.render 'admin' + constants.admin.route, settings.get()

module.exports.adminBuild = (custom_header, cb) ->
  custom_header.plugins.push
    route: constants.admin.route
    icon: constants.admin.icon
    name: constants.name
  cb null, custom_header