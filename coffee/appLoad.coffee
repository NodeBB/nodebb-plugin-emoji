module.exports.appLoad = (data, callback) ->
  initSockets()
  initAdminRoute data.app, data.middleware
  callback()