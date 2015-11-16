var	emoji = require('emoji-images'),
	nconf = module.parent.require('nconf'),
	Emoji = {};

Emoji.addEmoji = function(data, callback) {
	try {
		if (data && data.postData && data.postData.content) {
			
			data.postData.content =  data.postData.content.replace(/(^|<\/code>)([^<]*|<(?!code>))*(<code>|$)/g, function (match) {
				return emoji(match, nconf.get('url') + '/plugins/nodebb-plugin-emoji/images');
			});
			
			callback(null, data);
		}
	} catch(ex) {
		callback(ex, data);
    }
};

module.exports = Emoji;