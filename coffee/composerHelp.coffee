module.exports.composerHelp = (helpMessage, callback) ->
  mappingEnabled = getConfigInt 'killSkype'
  helpMessage += """
    <h2>Emoji Extended</h2>
    <p>
      This forum has emoji enabled.<br>
      Plugins begin end end with <code>:</code> like <code>:smile:</code>, <code>:wink:</code>, etc. For a full list see <a href="http://www.emoji-cheat-sheet.com">Emoji cheat sheet</a>.
    """
  if mappingEnabled
    helpMessage += """
      <br>
      Also some common shortens like <code>:)</code>, <code>:P</code>, <code>;)</code>, <code>:-)</code>, etc. can be used.
    """
  mappingEnabled += """
    </p>
    """
  callback null, helpMessage