module.exports.appLoad = (app, middleware, ignored) ->
  initSockets()
  initAdminRoute app, middleware