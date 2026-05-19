const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const iconsPath = path.join(__dirname, 'fontawesome/icons.yml');

const license = `
The Font Awesome font is licensed under the SIL OFL 1.1:
http://scripts.sil.org/OFL

Font Awesome CSS, LESS, and Sass files are licensed under the MIT License:
https://opensource.org/licenses/mit-license.html

The Font Awesome documentation is licensed under the CC BY 3.0 License:
https://creativecommons.org/licenses/by/3.0/

Full details: https://fontawesome.com/v4.7.0/license
`;

function slugify(input) {
  return input.toLowerCase().replace(/ /g, '-');
}

exports.defineEmoji = (data, callback) => {
  fs.readFile(iconsPath, 'utf8', (err, source) => {
    if (err) {
      callback(err);
      return;
    }

    const icons = yaml.parse(source).icons;

    const dictionary = {};
    icons.forEach((icon) => {
      dictionary[`fa-${icon.id}`] = {
        character: String.fromCodePoint(parseInt(icon.unicode, 16)),
        keywords: icon.filter,
        categories: icon.categories.map(x => `fa-${slugify(x)}`),
      };
    });

    data.packs.push({
      name: 'Font Awesome Emoji',
      id: 'fontawesome',
      attribution: 'Font Awesome by Dave Gandy - https://fontawesome.com/v5.15.4',
      path: __dirname,
      license,
      mode: 'font',
      font: {
        family: 'FontAwesome',
      },
      dictionary,
    });

    callback(null, data);
  });
};

exports.buildLanguageFile = () => {
  const source = fs.readFileSync(iconsPath, 'utf8');
  const icons = yaml.parse(source).icons;
  const categories = new Set([].concat(...icons.map(x => x.categories)));

  const translations = {};
  categories.forEach((category) => {
    translations[`categories.fa-${slugify(category)}`] = `Font Awesome ${category}`;
  });

  fs.writeFileSync(path.join(__dirname, 'public/language/en-US/emoji.json'), JSON.stringify(translations, null, 2));
};
