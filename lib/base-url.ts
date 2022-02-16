const nconf = require.main.require('nconf');

export function getBaseUrl(): string {
  const assetBaseUrl = nconf.get('asset_base_url');

  return assetBaseUrl.startsWith('http') ?
    assetBaseUrl :
    nconf.get('base_url') + assetBaseUrl;
}
