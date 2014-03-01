module.exports.addScripts = (scripts) ->
  scripts.concat [
    "plugins/nodebb-plugin-emoji-extended/js/lib/jquery.textcomplete.min.js"
    "plugins/nodebb-plugin-emoji-extended/js/emoji-textcomplete.js"
  ]