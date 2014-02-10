constants = Object.freeze
  'name': "Emoji Extended"
  'admin':
    'route': '/emoji-extended'
    'icon': 'fa-smile-o'

module.exports.adminBuild = (custom_header) ->
  custom_header.plugins.push
    route: constants.admin.route
    icon: constants.admin.icon
    name: constants.name
  custom_header
module.exports.adminRoute = (custom_routes, cb) ->
  fs.readFile path.resolve(__dirname, './templates/admin.tpl'), (err, tpl) ->
    custom_routes.routes.push
      route: constants.admin.route
      method: "get"
      options: (req, res, cb) ->
        cb
          req: req
          res: res
          route: constants.admin.route
          name: constants.name
          content: tpl
    cb null, custom_routes