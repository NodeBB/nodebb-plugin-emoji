import { Router, Request, Response, RequestHandler } from 'express';
import { join } from 'path';
import { rename } from 'fs';
import * as multer from 'multer';

import * as settings from './settings';
import { build } from './pubsub';

const nconf = require.main.require('nconf');

const version: string = require(join(__dirname, '../../package.json')).version;

export default function controllers({ router, middleware }: {
  router: Router,
  middleware: { admin: { [key: string]: RequestHandler } },
}) {
  const renderAdmin: RequestHandler = (req, res, next) => {
    settings.get((err, sets) => {
      if (err) {
        next(err);
        return;
      }

      res.render('admin/plugins/emoji', {
        version,
        settings: sets,
      });
    });
  };

  router.get('/admin/plugins/emoji', middleware.admin.buildHeader, renderAdmin);
  router.get('/api/admin/plugins/emoji', renderAdmin);

  const saveAdmin: RequestHandler = (req, res, next) => {
    const data = JSON.parse(req.query.settings);
    settings.set(data, (err) => {
      if (err) {
        next(err);
        return;
      }

      res.send('OK');
    });
  };
  router.get('/api/admin/plugins/emoji/save', saveAdmin);

  const adminBuild: RequestHandler = (req, res, next) => {
    build((err) => {
      if (err) {
        next(err);
      } else {
        res.send('OK');
      }
    });
  };
  router.get('/api/admin/plugins/emoji/build', adminBuild);

  const uploadEmoji: RequestHandler = (req, res, next) => {
    if (!req.file) {
      res.sendStatus(400);
      return;
    }

    const fileName = req.body.fileName;
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

  router.post('/api/admin/plugins/emoji/upload', upload.single('emojiImage'), uploadEmoji);
}
