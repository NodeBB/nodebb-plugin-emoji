# Emoji for NodeBB

![Compatibility](https://packages.nodebb.org/api/v1/plugins/nodebb-plugin-emoji/compatibility.png)
[![Downloads](https://img.shields.io/npm/dm/nodebb-plugin-emoji.svg)](https://www.npmjs.com/package/nodebb-plugin-emoji)
[![Dependency Status](https://david-dm.org/NodeBB-Community/nodebb-plugin-emoji.svg)](https://david-dm.org/NodeBB/nodebb-plugin-emoji)

Adds extensible emoji functionality to NodeBB

 - Multiple sets of emoji available for use
 - Intelligent auto-completion while composing posts and chat messages
 - Ability to convert common emoticons like `:)` to emoji
 - Convenient dialog to view and insert all available emoji

## Installation

For best results, install `nodebb-plugin-emoji` and emoji packs through the NodeBB Admin Panel.

### Emoji packs

The following emoji packs are known to be compatible with `nodebb-plugin-emoji`

 - [nodebb-plugin-emoji-one](https://github.com/NodeBB-Community/nodebb-plugin-emoji-one)
 - [nodebb-plugin-emoji-apple](https://github.com/NodeBB-Community/nodebb-plugin-emoji-apple)
 - [nodebb-plugin-emoji-cubicopp](https://github.com/NodeBB-Community/nodebb-plugin-emoji-cubicopp)
 - [nodebb-plugin-emoji-vital](https://github.com/NodeBB-Community/nodebb-plugin-emoji-vital)

#### `emoji.js` / `emoji.json`

In version two of the emoji plugin, a completely new API is now used to create emoji sets. Now, an emoji set defines it's emojis in an `emoji` file in it's root directory.

This file can either be a simple JSON file defining the emoji pack, or it can be a Node module exporting a function. Both are expected to result in a schema defined in [lib/types.d.ts](lib/types.d.ts).

The `emoji.js` approach is useful when the pack needs to download assets, if it's easier to generate the dictionary on demand, or in any asynchronous situation.

On an emoji build, initiated either on first install of the plugin or through the plugin ACP page, the emoji plugin will look through **activated** plugins for an `emoji.js` or `emoji.json` file in the plugin root directory. It then requires the file from each matching plugin and does what is necessary to compile assets and metadata centrally.

### Manual installation

If `nodebb-plugin-emoji` is not available through the ACP, you can install it manually with NPM

    npm install nodebb-plugin-emoji
