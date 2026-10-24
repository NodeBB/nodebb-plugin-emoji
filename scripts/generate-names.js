/* eslint-disable strict, no-console, @typescript-eslint/no-var-requires */

/*
 * Generates public/emoji-names/<language>.json from the Unicode CLDR annotations: the name of every
 * emoji and its search keywords in that language. The files are committed, the build copies them to
 * build/emoji/names/ and the client loads the one that matches the user's language.
 *
 *   npm i --no-save cldr-annotations-full cldr-annotations-derived-full
 *   node scripts/generate-names.js he [more language codes, CLDR names: he, de, fr, pt, zh, ...]
 *
 * File format: { "<emoji character without U+FE0F>": "<name>|<keyword>|<keyword>..." }
 * Data: Unicode CLDR (Unicode License v3, https://www.unicode.org/license.txt).
 */
const fs = require('fs');
const path = require('path');

const langs = process.argv.slice(2);
if (!langs.length) {
  console.error('usage: node scripts/generate-names.js <language> [<language> ...]');
  process.exit(1);
}

const strip = str => str.replace(/️/g, '');
const out = path.join(__dirname, '../public/emoji-names');

function load(pkg, dir, key, lang) {
  const file = path.join(path.dirname(require.resolve(`${pkg}/package.json`)), dir, lang, 'annotations.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'))[key].annotations;
}

fs.mkdirSync(out, { recursive: true });

langs.forEach((lang) => {
  const base = load('cldr-annotations-full', 'annotations', 'annotations', lang);
  const derived = load('cldr-annotations-derived-full', 'annotationsDerived', 'annotationsDerived', lang);
  const names = {};

  Object.entries({ ...base, ...derived }).forEach(([character, data]) => {
    const name = (data.tts && data.tts[0]) || '';
    // the keywords of the name itself are not repeated
    const keywords = (data.default || []).filter(word => word !== name);
    if (name) {
      names[strip(character)] = [name, ...keywords].join('|');
    }
  });

  const sorted = Object.fromEntries(Object.keys(names).sort().map(key => [key, names[key]]));
  fs.writeFileSync(path.join(out, `${lang}.json`), `${JSON.stringify(sorted)}\n`);
  console.log(`${lang}: ${Object.keys(sorted).length} emoji`);
});
