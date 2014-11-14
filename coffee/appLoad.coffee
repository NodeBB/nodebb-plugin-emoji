module.exports.appLoad = (data, callback) ->
  initSockets()
  initAdminRoute data.router, data.middleware
  callback()