const nconf = require.main.require('nconf');

export function getBaseUrl(): string {
  const relative_path = nconf.get('relative_path') || '';
  const assetBaseUrl = nconf.get('asset_base_url') || `${relative_path}/assets`;

  return assetBaseUrl.startsWith('http') ?
    assetBaseUrl :
    nconf.get('base_url') + assetBaseUrl;
}
