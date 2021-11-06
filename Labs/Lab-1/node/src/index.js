import Koa from 'koa';
import WebSocket from 'ws';
import http from 'http';
import Router from 'koa-router';
import bodyParser from "koa-bodyparser";
import { timingLogger, exceptionHandler, jwtConfig, initWss, broadcast, verifyClient } from './utils';
import { router as noteRouter} from './note';
import { router as authRouter } from './auth';
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
app.use(bodyParser());

const prefix = '/api';

let categories = ['Do', 'Decide', 'Delegate', 'Delete'];

let lastId = 0, currentCategory = 0;

// public
const publicApiRouter = new Router({ prefix });
publicApiRouter
  .use('/auth', authRouter.routes());
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

setInterval(() => {
    lastId = `${parseInt(lastId) + 1}`;
    const task = { '_id': lastId, text: `task ${lastId}`, category: categories[currentCategory], userId: "vI1GMkzBza5i82zj"};
    currentCategory++;
    if (currentCategory >= categories.length)
        currentCategory = 0;
    noteStore.insert(task);
    console.log(`${task.text}`);
    broadcast("vI1GMkzBza5i82zj", { type: 'created', payload: task });
}, 5000);


server.listen(3000);
console.log('started on port 3000');
