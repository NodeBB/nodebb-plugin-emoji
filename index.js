var	emoji = require('emoji-images'),
	nconf = module.parent.require('nconf'),
	Emoji = {},
	mapTest = /(^|\s|<\/?[\w-]+>)(:[=-]?[\(\)\|\*\$@#\?]|:[=-]?&amp;|;[=-]?[\(\)]|[8b][=-]?[\)\|]|[\|i][-=]?[\(\)]|x[-=]?[\(\)]|:&quot;>|:\^\)|;\/\)|\?{3}|z{3}|o_o)|(^|\s|<(br|p)>)(&lt;3)(<\/?\w+>|\s|$)|(:[=-]?[dopsx])(<\/?[\w-]+>|\s|$)/ig,
	mapping = [
		/:[-=]?s/i, ':confounded:',
		/:[-=]?d/i, ':laughing:',
		/:[-=]?o/i, ':hushed:',
		/:[-=]?[x#]/i, ':no_mouth:',
		/:[-=]?[\*p]/i, ':stuck_out_tongue_winking_eye:',
		/:[-=]?\)/, ':grinning:',
		/:[-=]?\(/, ':frowning:',
		/[8b][-=]?[\|\)]/i, ':sunglasses:',
		/;[-=]?\)/, ':wink:',
		/;[-=]?\(/, ':relieved:',
		/:[-=]?\|/, ':expressionless:',
		/:[-=]?\$|:&quot>/, ':blush:',
		/:\^\)/, ':smirk:',
		/[\|i][-=]?\)/, ':sleeping:',
		/\|[-=]?\(/, ':pensive:',
		/:[-=]?&amp;/, ':mask:',
		/;\/\)/, ':trollface:',
		/:[-=]?@/, ':rage:',
		/x[-=]?\(/i, ':rage:',
		/:[-=]?\?/, ':confused:',
		/\?\?\?/, ':question:',
		/&lt;3/, ':heart:',
		/zzz/i, ':zzz:',
		/o_o/i, ':eyes:'
	];

function execMapping(content) {
	return content.replace(mapTest, function(match) {
		for (var i = 0; i < mapping.length; i ++) {
			var m = match.replace(mapping[i], mapping[++i]);
			if (m != match)
				return m;
		}
		return match;
	});
}

Emoji.addEmoji = function(postContent) {
	return postContent.replace(/(^|<\/code>)([^<]*|<(?!code>))*(<code>|$)/g, function (match) {
		return emoji(execMapping(match), nconf.get('url') + '/plugins/emoji-images');
	});
};

module.exports = Emoji;
