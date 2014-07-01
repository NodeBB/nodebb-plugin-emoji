# nodebb-plugin-emoji-extended

## Features

 + Emoticons as defined at [Emoji cheat sheet](http://www.emoji-cheat-sheet.com)
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

## Credits

[nodebb-plugin-emoji](https://github.com/julianlam/nodebb-plugin-emoji)

[Autocomplete for Textarea](https://github.com/yuku-t/jquery-textcomplete)