# nodebb-plugin-emoji-extended

## Features

 + Emoticons as defined at [Emoji cheat sheet](http://www.emoji-cheat-sheet.com)
 + Emoticons get updated on each server-startup (and each 24d)
 + Mapping of texts like `:)`, `;)`, etc.
 + [Autocomplete for Textarea](https://github.com/yuku-t/jquery-textcomplete) of emoticons (not for mapped ones)
 + Code-blocks get ignored (markdown-syntax)
 + API to add textcomplete to other fields

## Installation

    npm install nodebb-plugin-emoji-extended

## API

On client-side you have access to the `window.emojiExtended` object that provides the following attributes:

 * `[Array] list` A list of all available emoji-names.
 * `[String] path` The folder-URL that contains all image-files.
 * `[String] getPath(name)` Returns the URL of the image that shows the emoji of given name (case-insensitive).
 * `[Promise] ready` A promise that gets resolved once emoji-extended got initialized. Gets passed a function
   `addTextComplete(target, callback)`.
 * `[null] addCompletion(target, callback)` An alias for `ready` with forwarding parameters to resolved
   `addTextComplete` function.

If your script runs before emoji-extended you may listen to the event named `emoji-extended:initialized` triggered on
the `window`-object.

In conclusion to use the API of emoji-extended the client-side code within your plugin may look like this:

    function doSth(emojiExtended) {
      // emoji-extended is initialized, you may use the API here
    }
    
    if (typeof window.emojiExtended !== 'undefined')
      doSth(window.emojiExtended);
    else
      $(window).one('emoji-extended:initialized', doSth);


## Credits

[nodebb-plugin-emoji](https://github.com/julianlam/nodebb-plugin-emoji)

[Autocomplete for Textarea](https://github.com/yuku-t/jquery-textcomplete)