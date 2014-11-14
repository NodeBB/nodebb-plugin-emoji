constants = Object.freeze
  'name': "Emoji Extended"
  'admin':
    'route': '/plugins/emoji-extended'
    'icon': 'fa-smile-o'

renderAdminPage = (req, res, ignored) ->
  res.render 'admin/plugins/emoji-extended', {}

initAdminRoute = (router, middleware) ->
  appGet router, "/admin#{constants.admin.route}", middleware.admin.buildHeader, renderAdminPage

module.exports.adminBuild = (custom_header, cb) ->
  custom_header.plugins.push
    route: constants.admin.route
    icon: constants.admin.icon
    name: constants.name
  cb null, custom_header