var	emoji = require('emoji-images'),
	nconf = module.parent.require('nconf'),
	Emoji = {};

Emoji.addEmoji = function(postContent) {
	postContent = emoji(postContent, nconf.get('url') + '/plugins/emoji-images');

	return postContent;
};

module.exports = Emoji;