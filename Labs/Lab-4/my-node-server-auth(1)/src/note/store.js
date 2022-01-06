const Datastore = require('nedb-promises')

export class NoteStore {
  constructor({ filename, autoload }) {
    this.store = Datastore.create({filename, autoload});//new Datastore({ filename, autoload });
  }
  
  async find(props) {
    return this.store.find(props);
  }
  
  async findOne(props) {
    return this.store.findOne(props);
  }
  
  async insert(note) {
    let noteText = note.text;
    console.log("From store: ");
    console.log(note);
    console.log(noteText)
    if (!noteText) { // validation
      throw new Error('Missing text property')
    }
    var data = Object.create({text:note.text, category:note.category, userId:note.userId});
    console.log(data)
    console.log({text:note.text, category:note.category, userId:note.userId})
    return this.store.insert({text:note.text, category:note.category, userId:note.userId});
  };
  
  async update(props, note) {
    return this.store.update(props, note);
  }
  
  async remove(props) {
    return this.store.remove(props);
  }
}

export default new NoteStore({ filename: './db/notes.json', autoload: true });