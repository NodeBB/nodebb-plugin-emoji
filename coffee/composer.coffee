module.exports.composerHelp = (helpMessage, callback) ->
  mappingEnabled = settings.get 'mapping.enabled'
  helpMessage += """
    <h2>Emoji Extended</h2>
    <p>
      This forum has <a href="http://www.emoji-cheat-sheet.com">emoji cheat sheet</a> enabled.<br/>
      Emoji are enclosed by <code>:</code> like <code>:smile:</code> <code>:wink:</code> etc.<br/>
      Click the smiley-button of the composer to browse all emoji by category.
    """
  if mappingEnabled
    helpMessage += """
      <br/>
      Also some common shortens like <code>:)</code> <code>:P</code> <code>;)</code> <code>:-)</code> etc. will get
      converted into appropriate emoji automatically.
    """
  helpMessage += """
    </p>
    """
  callback null, helpMessage

module.exports.composerFormatting = (data, callback) ->
  data.options.push
    name: "emoji-extended"
    className: "fa fa-smile-o"
  callback null, data