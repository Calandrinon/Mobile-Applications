import dataStore from 'nedb-promise';

export class PhotoStore {
  constructor({ filename, autoload }) {
    this.store = dataStore({ filename, autoload });
  }
  
  async find(props) {
    return this.store.find(props);
  }
  
  async findOne(props) {
    return this.store.findOne(props);
  }
  
  async insert(photo, userId) {
    return this.store.insert({photo, userId});
  };

  async remove(props) {
    return this.store.remove(props);
  }

  async getAll(userId) {
    return this.store.find({userId: userId}, (error, docs) => {
      return error ? error : docs;
    });
  }
}

export default new PhotoStore({ filename: './db/photos.json', autoload: true });