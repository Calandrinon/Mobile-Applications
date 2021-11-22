import Router from 'koa-router';
import userStore from './store';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../utils';
import noteStore from "../note/store";

export const router = new Router();

const createToken = (user) => {
  return jwt.sign({ username: user.username, _id: user._id }, jwtConfig.secret, { expiresIn: 60 * 60 * 60 });
};

const createUser = async (user, response) => {
  try {
    await userStore.insert(user);
    response.body = { token: createToken(user) };
    response.status = 201; // created
  } catch (err) {
    response.body = { issue: [{ error: err.message }] };
    response.status = 400; // bad request
  }
};

router.post('/signup', async (ctx) => await createUser(ctx.request.body, ctx.response));

router.post('/login', async (ctx) => {
  const credentials = ctx.request.body;
  const response = ctx.response;
  const user = await userStore.findOne({ username: credentials.username });
  console.log("/login AUTH user");
  console.log(user);
  console.log("CREDENTIALS PASSWORD:");
  console.log(credentials.password);
  console.log("USER PASSWORD:");
  console.log(user.password);
  if (user && credentials.password === user.password) {
    response.body = { token: createToken(user) };
    response.status = 201; // created
  } else {
    response.body = { issue: [{ error: 'Invalid credentials' }] };
    response.status = 400; // bad request
  }
});

router.get('/users', async (ctx) => {
  const response = ctx.response;
  response.body = await userStore.getAll();
  response.status = 200;
});

router.post("/users", async (ctx) => {
  const request = ctx.request;
  const response = ctx.response;
  const username = request.body.username;
  const user = await userStore.findOne({username: username});
  response.body = {id: user._id};
});

router.post("/getUsernameById", async (ctx) => {
  const request = ctx.request;
  const response = ctx.response;
  const userId = request.body.userId;
  console.log(`The ID sent from the frontend:`);
  console.log(userId);
  const user = await userStore.findOne({_id: userId});
  response.body = user
      ? {username: user.username}
      : {error: "The user doesn't exist or it doesn't have a token saved in the local storage."};
});

router.put('/users/:id', async (ctx) => {
  const userId = ctx.params.id;
  const userDetails = ctx.request.body;
  console.log("User details:");
  console.log(userDetails);
  await userStore.update({_id: userId}, userDetails);
  console.log("Update completed.");
  ctx.response.status = 200;
});

router.post('/logoff', async (ctx) => {
  const requestBody = ctx.request.body;
  console.log("The user ID is:");
  console.log(requestBody.id);
  const user = await userStore.findOne({_id: requestBody.id});
  user.status = false;
  await userStore.update({_id: requestBody.id}, user);
  ctx.response.status = 200;
});

router.post('/updateUserStatus', async (ctx) => {
  const request = ctx.request;
  const response = ctx.response;
  const userId = request.body.userId;

  console.log(`The ID sent from the frontend:`);
  console.log(userId);

  const user = await userStore.findOne({_id: userId});
  user.status = request.body.status;

  await userStore.update({_id: userId}, user);
  console.log("User status update completed.");

  response.status = 200;
  response.body = user;
});


