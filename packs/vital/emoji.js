const fs = require('fs');
const path = require('path');

exports.defineEmoji = (data, callback) => {
  fs.readFile(path.join(__dirname, 'emoji/LICENSE'), (err, buffer) => {
    if (err) {
      callback(err);
      return;
    }

    const license = buffer.toString();

    data.packs.push({
      name: 'Vital Emoji',
      id: 'vital',
      attribution: '',
      path: __dirname,
      license,
      mode: 'images',
      images: {
        directory: 'emoji',
      },
      dictionary: {
        trollface: {
          aliases: ['troll'],
          image: 'trollface.png',
          character: '',
        },
        squirrel: {
          aliases: ['shipit'],
          image: 'squirrel.png',
          character: '🐿️',
        },
        octocat: {
          aliases: ['github'],
          image: 'octocat.png',
          character: '',
        },
        feelsgood: {
          aliases: [],
          keywords: ['doom', 'space', 'marine'],
          image: 'feelsgood.png',
          character: '',
        },
        finnadie: {
          aliases: [],
          keywords: ['doom', 'space', 'marine'],
          image: 'finnadie.png',
          character: '',
        },
        goberserk: {
          aliases: [],
          keywords: ['doom', 'space', 'marine'],
          image: 'goberserk.png',
          character: '',
        },
        godmode: {
          aliases: ['invincible'],
          keywords: ['doom', 'space', 'marine'],
          image: 'godmode.png',
          character: '',
        },
        hurtrealbad: {
          aliases: ['ouch'],
          keywords: ['doom', 'space', 'marine'],
          image: 'hurtrealbad.png',
          character: '😧',
        },
        rage1: {
          aliases: [],
          keywords: ['doom', 'space', 'marine'],
          image: 'rage1.png',
          character: '😠',
        },
        rage2: {
          aliases: [],
          keywords: ['doom', 'space', 'marine'],
          image: 'rage2.png',
          character: '😠',
        },
        rage3: {
          aliases: [],
          keywords: ['doom', 'space', 'marine'],
          image: 'rage3.png',
          character: '😠',
        },
        rage4: {
          aliases: [],
          keywords: ['doom', 'space', 'marine'],
          image: 'rage4.png',
          character: '😠',
        },
        suspect: {
          aliases: ['suspicious'],
          keywords: ['doom', 'space', 'marine'],
          image: 'suspect.png',
          character: '',
        },
      },
    });

    callback(null, data);
  });
};
