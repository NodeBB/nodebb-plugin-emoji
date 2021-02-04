/* eslint-disable */

// ensure all packs have the correct peer dependency, repository url, and homepage url

import assert from 'assert';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { satisfies } from 'semver';

const packsDir = join(__dirname, '../../packs');
const packs = readdirSync(packsDir).filter(dir => statSync(join(packsDir, dir)).isDirectory());

const manifest = require('../../package.json');

packs.forEach((pack) => {
  const packManifest = require(`../../packs/${pack}/package.json`);

  assert.strictEqual(packManifest.repository.url, manifest.repository.url, `pack "${packManifest.name}: invalid repository url "${packManifest.repository.url}"`);
  assert(packManifest.homepage.startsWith(`${manifest.homepage}/tree/master/packs/`), `pack "${packManifest.name}: invalid homepage "${packManifest.homepage}"`);
  const range = packManifest.peerDependencies['nodebb-plugin-emoji'];
  assert(satisfies(manifest.version, range), `pack "${packManifest.name}": peer dependency range "${range}" not satisfied by version "${manifest.version}"`);
});
