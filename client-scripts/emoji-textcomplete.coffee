exports = window.emojiExtended =
  addCompletion: (object, cb) ->
    this.ready.then (addTextComplete) ->
      addTextComplete object, cb
    , cb
    null
  path: "#{RELATIVE_PATH}/plugins/nodebb-plugin-emoji-extended/images/"
  getPath: (name) -> if name? then "#{this.path}#{encodeURIComponent name.toLowerCase()}.png" else this.path
  list: []
  ready: new Promise (resolve, reject) ->
    $(document).ready -> socket.emit 'modules.emojiExtended', null, (err, data) ->
      if err?
        console.error "Error while initializing emoji-extended."
        console.error err
        return reject err
      exports.list = data.list
      maxCount = data.settings.maxCount
      minChars = data.settings.minChars
      completePrefix = data.settings.completePrefix
      zoom = data.settings.zoom
      emojiSize = 20
      style = """
          <style type="text/css">
            .emoji {
              width: 20px;
              height: 20px;
              transition: z-index,margin,width,height;
              transition-timing-function: ease-in-out;
              transition-duration: 0.2s;
              transition-delay: 0.2s;
              z-index: 0;
            }
      """
      if zoom > 0
        zoom = 512 if zoom > 512
        style += """
            .emoji:hover {
              width: #{zoom}px;
              height: #{zoom}px;
              margin: #{-(zoom-emojiSize)/2}px;
              z-index: #{zoom};
            }
            """
      $('head').append style + '\n</style>'

      # returns zero if the line-end may not be within an inline code-tag whatever may follow. takes O(length)
      isInlineCodeContext = (line) ->
        beginSize = 0 # amount of accents that began the current possible code-content
        currentSize = 0 # amount of accents at current possible code-end
        escaped = false # last char was backslash
        begin = true # before or within possible code-begin
        since = '' # string since last code-begin
        ignoreSince = /^\s+`*$/ # regex that matches non-code-content (`` `` is not closing)
        for char in line
          if char == '`' && !(escaped && begin) && !ignoreSince.test since
            if begin then beginSize++ else currentSize++; since += char
          else if currentSize == beginSize && beginSize # found end of code
            beginSize = currentSize = 0
            begin = true
            since = ''
          else
            if begin && beginSize
              begin = false
            since += char
            currentSize = 0
          escaped = (char == '\\')
        beginSize

      codeInListRegex = (indent) ->
        #                 space only | tab only      | tab space    | space tab
        if indent == 3 then /^( {8}\s|( {0,3}\t){2}\s| {0,3}\t {4}\s| {4,7}\t\s)/ else
          new RegExp "^( {#{indent + 6}}|( {0,3}\\t){2}| {0,3}\\t( {0,#{indent + 2}})| {4,7}\\t)"
      #                      space only | tab only     | tab space                   | space tab

      # checks whether the current line is within a code-block (handles lists, doesn't handle quotes)
      isBlockCodeContext = (lines) ->
        list = false
        code = false
        prevEmpty = true
        emptyR = /^\s*$/
        listR = /^( {0,3})[\+*-]\s/
        codeR = /^ {4,}| {0,3}\t/
        codeInList = null
        for line in lines
          empty = emptyR.test line
          list = (list && !(prevEmpty && empty))
          if l = line.match listR
            list = true
            codeInList = codeInListRegex l[1].length
          code = list && codeInList.test(line) || !list && (prevEmpty || code) && codeR.test line
          prevEmpty = empty
        code

      # returns whether the end of the term (last line, EOL) cannot be within code-context (no possible suffix)
      isSmileyContext = (term) ->
        lines = term.match(/^.*$/gm)
        return !(isInlineCodeContext(lines[lines.length - 1]) || isBlockCodeContext lines)

      resolve.call exports, (object, cb) ->
        object = $ object if !(object instanceof $)
        if object.data 'emoji-extended-added'
          cb new Error 'Already added' if typeof cb == 'function'
          return
        object.data 'emoji-extended-added', '1'
        object.textcomplete [
          #  anything before not ending with $completePrefix   : any words/numbers/+/-, count from minChars to any
          match: new RegExp "^((([\\s\\S]*)(#{completePrefix})):[\\w\\d+-]{#{minChars},})$", "i"
          search: (term, callback) ->
            if !isSmileyContext term
              callback []
              return;
            smileyPrefix = term.match(/:([\w\d\+-]*)$/)[1]
            regexp = new RegExp '^' + (smileyPrefix.replace /\+/g, '\\+'), 'i'
            callback $.grep exports.list, (emoji) -> regexp.test emoji
          replace: (value) -> '$2:' + value.toLowerCase() + ': '
          template: (value) ->
            "<img class='emoji emoji-extended img-responsive' src='#{exports.getPath value}' /> #{value}"
          maxCount: maxCount
          index: 1
        ]
        object.closest('.textcomplete-wrapper').css('height', '100%').find('textarea').css 'height', '100%'
        cb() if typeof cb == 'function'

$(window).on 'action:composer.loaded', (ignored, data) ->
  console.log 1
  exports.addCompletion $ "#cmp-uuid-#{data.post_uuid} .write"
$(window).on 'action:chat.loaded', -> exports.addCompletion $ "#chat-message-input"
$(window).trigger 'emoji-extended:initialized', exports