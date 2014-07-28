module.exports.appLoad = (app, middleware, ignored, callback) ->
  initSockets()
  initAdminRoute app, middleware
  callback()