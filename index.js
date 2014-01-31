var	emoji = require('emoji-images'),
	nconf = module.parent.require('nconf'),
	Emoji = {};

Emoji.addEmoji = function(postContent) {
	postContent = emoji(postContent, nconf.get('url') + '/plugins/nodebb-plugin-emoji/pngs');

	return postContent;
};

module.exports = Emoji;