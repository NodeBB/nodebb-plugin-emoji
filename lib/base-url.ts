const nconf = require.main.require('nconf');

const apiControllers = require.main.require('./src/controllers/api');

export async function getBaseUrl(): Promise<string> {
  const { assetBaseUrl } = await apiControllers.loadConfig({ uid: 0, query: { } });

  return assetBaseUrl.startsWith('http') ?
    assetBaseUrl :
    nconf.get('base_url') + assetBaseUrl;
}
