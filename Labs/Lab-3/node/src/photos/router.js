import Router from 'koa-router';
import photoStore from './store';
import { broadcast } from "../utils";

export const router = new Router();

const createPhotos = async (ctx, photos, response) => {
  try {
    const userId = photos[0].userId;
    let savedPhotos = (await photoStore.getAll(userId)).map((photo) => photo.filepath);
    console.log("Saved photos:");
    console.log(savedPhotos);
    let newPhotos = photos.filter((photo) => photo.filepath );
    for (let photoIndex in photos) {
      console.log("Photo:");
      console.log(photos[photoIndex]);
      await photoStore.insert(photos[photoIndex]);
    }
    response.body = "Photo uploaded.";
    response.status = 201;
    broadcast(userId, { type: 'created', payload: photos });
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
