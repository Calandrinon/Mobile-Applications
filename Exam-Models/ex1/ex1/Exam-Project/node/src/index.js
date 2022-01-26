import Koa from 'koa';
import WebSocket from 'ws';
import http from 'http';
import Router from 'koa-router';
import bodyParser from "koa-bodyparser";
import { timingLogger, exceptionHandler, jwtConfig, initWss, broadcast, verifyClient } from './utils';
import { router as noteRouter} from './note';
import { router as authRouter } from './auth';
import { router as photoRouter } from './photos';
import jwt from 'koa-jwt';
import cors from '@koa/cors';
import noteStore from "./note/store";

const app = new Koa();
const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server });
initWss(wss);

app.use(cors());
app.use(timingLogger);
app.use(exceptionHandler);
app.use(bodyParser({
    jsonLimit: "100mb"
}));

const prefix = '/api';

let categories = ['Do', 'Decide', 'Delegate', 'Delete'];

// public
const publicApiRouter = new Router({ prefix });
publicApiRouter
  .use('/auth', authRouter.routes())
  .use('/photo', photoRouter.routes());
app
  .use(publicApiRouter.routes())
  .use(publicApiRouter.allowedMethods());

app.use(jwt(jwtConfig));

// protected
const protectedApiRouter = new Router({ prefix });
protectedApiRouter
  .use('/item', noteRouter.routes());
app
  .use(protectedApiRouter.routes())
  .use(protectedApiRouter.allowedMethods());


server.listen(3000);
console.log('started on port 3000');
