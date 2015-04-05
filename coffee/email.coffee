EMAIL_STYLE = ".emoji { height:16px; width:16px; vertical-align:middle; margin-bottom:-1px; }"

module.exports.email = (data) ->
  data.html += "\n<style type='text/css'>" + EMAIL_STYLE + "</style>"