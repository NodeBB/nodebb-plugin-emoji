constants = Object.freeze
  'name': "Emoji Extended"
  'admin':
    'route': '/plugins/emojiExtended'
    'icon': 'fa-smile-o'

renderAdminPage = (req, res, ignored) ->
  res.render 'admin/plugins/emojiExtended', {}

initAdminRoute = (app, middleware) ->
  appGet app, "/admin#{constants.admin.route}", middleware.admin.buildHeader, renderAdminPage

module.exports.adminBuild = (custom_header) ->
  custom_header.plugins.push
    route: constants.admin.route
    icon: constants.admin.icon
    name: constants.name
  custom_header