var	emoji = require('emoji-images'),
	nconf = module.parent.require('nconf'),
	Emoji = {};

Emoji.addEmoji = function(postContent) {
	return postContent.replace(/(^|<\/code>)([^<]*|<(?!code>))*(<code>|$)/g, function (match) {
		return emoji(match, nconf.get('url') + '/plugins/nodebb-plugin-emoji/images');
	});
};

module.exports = Emoji;