import Router from 'koa-router';
import photoStore from './store';
import { broadcast } from "../utils";

export const router = new Router();

const createPhotos = async (ctx, photos, response) => {
  console.log("Photos:");
  console.log(photos);
  try {
    const userId = photos.userId;
    console.log("User ID:");
    console.log(userId);
    //response.body = await photoStore.insert(photos);
    response.status = 201; // created
    //broadcast(userId, { type: 'created', payload: photo });
  } catch (err) {
    response.body = { message: err.message };
    console.log("Some error:");
    console.log(err.message);
    response.status = 400; // bad request
  }
};

router.post('/', async ctx => {
  console.log("POST request: uploading a photo...");
  await createPhotos(ctx, ctx.request.body, ctx.response);
});
