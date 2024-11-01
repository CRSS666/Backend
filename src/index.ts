import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

import Database from '@/util/database';
import Status from '@/enum/status';

import { Request, Response } from '@/util/handler';

import rateLimiter from '@/util/ratelimit';
import getRoutes from '@/util/get_routes';
import pathParser from '@/util/path_parser';

const app = express();

const PORT = parseInt(process.env.PORT!) || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(rateLimiter);

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Backend/1.0.0');

  next();

  console.log(
    `${req.ip} "${req.method} ${req.path} HTTP/${req.httpVersion}" ${res.statusCode} ${res.get('Content-Length') ? res.get('Content-Length') : '0'} "${req.get('Referer') ? req.get('Referer') : '-'}" "${req.get('User-Agent')}"`
  );
});

(async () => {
  const db = new Database();

  const routes: string[] = await getRoutes(path.join(__dirname, 'routes'));

  for (const route of routes) {
    const routePath = pathParser(
      route.replace(__dirname, '').replace(/\\/g, '/')
    );
    const routeHandler = await import(route);

    app.all(routePath, (req, res) => {
      try {
        routeHandler.default(new Request(req), new Response(res, req));
      } catch (err: any) {
        console.error(err.message);

        res.status(Status.INTERNAL_SERVER_ERROR).json({
          error: Status.INTERNAL_SERVER_ERROR,
          message: err.message
        });
      }
    });
  }

  app.use((req, res) => {
    res.status(Status.NOT_FOUND).json({
      error: Status.NOT_FOUND,
      message: 'Route not found.'
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})().catch((err) => {
  console.error(err.message);
});
