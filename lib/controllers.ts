import { Router, Request, Response, RequestHandler, ErrorHandler } from 'express';
import { join } from 'path';

import * as settings from './settings';
import { build } from './pubsub';

const version: string = require(join(__dirname, '../../package.json')).version;

export default function controllers({ router, middleware }: {
  router: Router,
  middleware: { admin: { [key: string]: RequestHandler | ErrorHandler } },
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
}
