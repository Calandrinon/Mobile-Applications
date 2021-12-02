import Router from 'koa-router';
import photoStore from './store';
import { broadcast } from "../utils";

export const router = new Router();

const createPhoto = async (ctx, photo, response) => {
  console.log("Photo:");
  console.log(photo);
  try {
    console.log("User:");
    console.log(ctx.state.user);
    const userId = ctx.state.user._id;
    console.log("User ID:");
    console.log(userId);
    photo.userId = userId;
    response.body = await photoStore.insert(photo);
    response.status = 201; // created
    broadcast(userId, { type: 'created', payload: photo });
  } catch (err) {
    response.body = { message: err.message };
    console.log("Some error:");
    console.log(err.message);
    response.status = 400; // bad request
  }
};

router.post('/', async ctx => {
  console.log("POST request: uploading a photo...");
  await createPhoto(ctx, ctx.request.body, ctx.response);
});
