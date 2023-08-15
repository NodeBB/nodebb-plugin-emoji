import { join, basename } from 'path';
import { rename } from 'fs';
import { Router, RequestHandler } from 'express';
import multer from 'multer';

import * as settings from './settings';
import { build } from './pubsub';
import * as customizations from './customizations';

const nconf = require.main.require('nconf');
const { setupApiRoute, setupAdminPageRoute } = require.main.require('./src/routes/helpers');
const { formatApiResponse } = require.main.require('./src/controllers/helpers');

// eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-var-requires
const version: string = require(join(__dirname, '../../package.json')).version;

export default function controllers({ router, middleware }: {
  router: Router;
  middleware: { authenticate: RequestHandler; admin: { [key: string]: RequestHandler } };
}): void {
  const renderAdmin: RequestHandler = (req, res, next) => {
    settings.get().then(sets => setImmediate(() => {
      res.render('admin/plugins/emoji', {
        version,
        settings: sets,
      });
    }), err => setImmediate(next, err));
  };
  setupAdminPageRoute(router, '/admin/plugins/emoji', renderAdmin);

  const updateSettings: RequestHandler = async (req, res) => {
    const data = req.body;
    await settings.set({
      parseAscii: !!data.parseAscii,
      parseNative: !!data.parseNative,
      customFirst: !!data.customFirst,
      parseTitles: !!data.parseTitles,
    });
    formatApiResponse(200, res);
  };
  setupApiRoute(router, 'put', '/api/v3/admin/plugins/emoji/settings', [middleware.admin.checkPrivileges], updateSettings);

  const buildAssets: RequestHandler = async (req, res) => {
    await build();
    formatApiResponse(200, res);
  };
  setupApiRoute(router, 'put', '/api/v3/admin/plugins/emoji/build', [middleware.admin.checkPrivileges], buildAssets);

  const provideCustomizations: RequestHandler = async (req, res) => {
    const data = await customizations.getAll();
    formatApiResponse(200, res, data);
  };
  setupApiRoute(router, 'get', '/api/v3/admin/plugins/emoji/customizations', [middleware.admin.checkPrivileges], provideCustomizations);

  const addCustomization: RequestHandler = async (req, res) => {
    const type = req.params.type;
    const item = req.body.item;
    if (!['emoji', 'adjunct'].includes(type)) {
      formatApiResponse(400, res);
      return;
    }
    const id = await customizations.add({ type, item });
    formatApiResponse(200, res, { id });
  };
  setupApiRoute(router, 'post', '/api/v3/admin/plugins/emoji/customizations/:type', [middleware.admin.checkPrivileges], addCustomization);

  const editCustomization: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const type = req.params.type;
    const item = req.body.item;
    if (!['emoji', 'adjunct'].includes(type)) {
      formatApiResponse(400, res);
      return;
    }
    await customizations.edit({ type, id, item });
    formatApiResponse(200, res);
  };
  setupApiRoute(router, 'put', '/api/v3/admin/plugins/emoji/customizations/:type/:id', [middleware.admin.checkPrivileges], editCustomization);

  const deleteCustomization: RequestHandler = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const type = req.params.type;
    if (!['emoji', 'adjunct'].includes(type)) {
      formatApiResponse(400, res);
      return;
    }
    await customizations.remove({ type, id });
    formatApiResponse(200, res);
  };
  setupApiRoute(router, 'delete', '/api/v3/admin/plugins/emoji/customizations/:type/:id', [middleware.admin.checkPrivileges], deleteCustomization);

  const uploadEmoji: RequestHandler = (req, res, next) => {
    if (!req.file) {
      res.sendStatus(400);
      return;
    }

    const fileName = basename(req.body.fileName);
    rename(req.file.path, join(nconf.get('upload_path'), 'emoji', fileName), (err) => {
      if (err) {
        next(err);
      } else {
        res.sendStatus(200);
      }
    });
  };

  const upload = multer({
    dest: join(nconf.get('upload_path'), 'emoji'),
  });

  router.post('/api/admin/plugins/emoji/upload', middleware.admin.checkPrivileges, upload.single('emojiImage'), uploadEmoji);
}
