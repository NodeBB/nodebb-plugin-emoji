# nodebb-plugin-emoji-extended

## Features

 + Emoticons as defined at [Emoji cheat sheet](http://www.emoji-cheat-sheet.com)
 + Emoticons get updated on each server-startup (and each 24d)
 + Mapping of texts like `:)`, `;)`, etc.
 + [Autocomplete for Textarea](https://github.com/yuku-t/jquery-textcomplete) of emoticons (not for mapped ones)
 + Code-blocks get ignored (markdown-syntax)
 + API to add textcomplete to other fields (by default parsing posts and chat)

## Installation

The preferred way of installing plugins is via your NodeBB Admin-CP since this ensures the compatibility of plugins with
you NodeBB version.

Please ensure you **don't have `nodebb-plugin-emoji` enabled** since this causes parsing-conflicts.

### Deprecated

    npm install nodebb-plugin-emoji-extended

## Client-Side API (usable by other plugins)

On client-side you have access to the `window.emojiExtended` object that provides the following attributes:

 * `[Array] list` A list of all available emoji-names.
 * `[Boolean] updated` Whether `emoji-extended:updated` has been triggered yet (see below).
 * `[String] path` The folder-URL that contains all image-files.
 * `[String] version` The version-string of emoji-extended.
 * `[String] getPath(name)` Returns the URL of the image that shows the emoji of given name (case-insensitive).
 * `[Promise] ready` A promise that gets resolved once emoji-extended got initialized. Gets passed a function
   `addTextComplete(target, callback)`.
 * `[null] addCompletion(target, callback)` An alias for `ready` with forwarding parameters to resolved
   `addTextComplete` function.

Events called on `window`:

 * `emoji-extended:initialized` Emoji-Extended has been initialized, `window.emojiExtended` got created.
 * `emoji-extended:updated` Data got retrieved from server (`window.emojiExtended.list` and
     `window.emojiExtended.version` got updated)

In conclusion to use the API of emoji-extended the client-side code within your plugin may look like this:

    function doSth(emojiExtended) {
      // emoji-extended is initialized, you may use the API here
    }
    
    if (typeof window.emojiExtended !== 'undefined')
      doSth(window.emojiExtended);
    else
      $(window).one('emoji-extended:initialized', doSth);


## Credits

[emoji-parser](https://github.com/frissdiegurke/emoji-parser)

[nodebb-plugin-emoji](https://github.com/julianlam/nodebb-plugin-emoji)

[Autocomplete for Textarea](https://github.com/yuku-t/jquery-textcomplete)