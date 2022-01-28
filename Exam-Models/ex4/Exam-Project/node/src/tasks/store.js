import dataStore from 'nedb-promise';

export class TaskStore {
    constructor({filename, autoload}) {
        this.store = dataStore({filename, autoload});
    }

    async find(props) {
        return this.store.find(props);
    }

    async findOne(props) {
        return this.store.findOne(props);
    }

    async insert(task) {
        return this.store.insert(task);
    };

    async update(props, task) {
        return this.store.update(props, task);
    }

    async remove(props) {
        return this.store.remove(props);
    }

    async getAll(userId) {
        return this.store.find({userId: userId}, (error, docs) => {
            return error ? error : docs;
        });
    }
}

export default new TaskStore({filename: './db/tasks.json', autoload: true});

