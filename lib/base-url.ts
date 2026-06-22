const nconf = nodebb.require('nconf');

export function getBaseUrl(): string {
  const relative_path = nconf.get('relative_path') || '';
  const asset_base_url = nconf.get('asset_base_url') || `${relative_path}/assets`;

  return asset_base_url.startsWith('http') ?
    asset_base_url :
    nconf.get('base_url') + asset_base_url;
}
