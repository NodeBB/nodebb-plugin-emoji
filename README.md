# Emoji for NodeBB

![Compatibility](https://packages.nodebb.org/api/v1/plugins/nodebb-plugin-emoji/compatibility.png)
[![Downloads](https://img.shields.io/npm/dm/nodebb-plugin-emoji.svg)](https://www.npmjs.com/package/nodebb-plugin-emoji)
[![Dependency Status](https://david-dm.org/NodeBB-Community/nodebb-plugin-emoji.svg)](https://david-dm.org/NodeBB/nodebb-plugin-emoji)

Adds extensible emoji functionality to NodeBB

 - Multiple sets of emoji available for use
 - Intelligent auto-completion while composing posts and chat messages
 - Ability to convert common emoticons like `:)` to emoji
 - Convenient dialog to view and insert all available emoji
 - First-party support for custom emoji (available in the ACP)

## Installation

For best results, install `nodebb-plugin-emoji` and emoji packs through the NodeBB Admin Panel.

### Emoji packs

The following emoji packs are known to be compatible with `nodebb-plugin-emoji`

 - [nodebb-plugin-emoji-android](https://github.com/NodeBB/nodebb-plugin-emoji/tree/master/packs/android)
 - [nodebb-plugin-emoji-one](https://github.com/NodeBB/nodebb-plugin-emoji/tree/master/packs/one)
 - [nodebb-plugin-emoji-apple](https://github.com/NodeBB/nodebb-plugin-emoji/tree/master/packs/apple)
 - [nodebb-plugin-emoji-cubicopp](https://github.com/NodeBB/nodebb-plugin-emoji/tree/master/packs/cubicopp)
 - [nodebb-plugin-emoji-vital](https://github.com/NodeBB/nodebb-plugin-emoji/tree/master/packs/vital)
 - [nodebb-plugin-emoji-fontawesome](https://github.com/NodeBB/nodebb-plugin-emoji/tree/master/packs/fontawesome)

To add custom emoji, visit the **Emoji** ACP page and click on the pencil button in the bottom left.

#### Hook: `filter:emoji.packs`

In version two of the emoji plugin, a completely new API is now used to create emoji sets. Now, an emoji set defines its emojis via a hook that is emoitted by the emoji plugin when a build of emoji assets is run.

To use this, you must listen for the hook by adding it to `plugin.json` like so:
```json
{
  "library": "emoji.js",
  "hooks": [
    { "hook": "filter:emoji.packs", "method": "defineEmoji" }
  ]
}
```

And then providing the `defineEmoji` function in your library file (`emoji.js` here):
```js
exports.defineEmoji = function (data, callback) {
  data.packs.push({
    name: 'My Emoji Pack',
    id: 'my-emoji',
    attribution: '',
    path: __dirname,
    license: '',
    mode: 'images',
    images: {
      directory: 'emoji',
    },
    dictionary: {
      custom: {
        aliases: ['personalized'],
        image: 'custom.png',
        character: '',
      },
    },
  });

  callback(null, data);
};
```

In the above case, we define the emoji pack "My Emoji Pack" and one emoji: `custom` which has an alias of `personalized`, with an image named `custom.png` in the `emoji` directory. For full documentation, I suggest going [to the interface definitions for `Emoji` and `EmojiDefinition`](lib/types.d.ts).

On an emoji build, initiated either on first install of the plugin or through the plugin ACP page, the emoji plugin will fire that hook and gather all emoji packs, then process them to produce metadata files it uses on the client side.

### Manual installation

If `nodebb-plugin-emoji` is not available through the ACP, you can install it manually with NPM

    npm install nodebb-plugin-emoji
