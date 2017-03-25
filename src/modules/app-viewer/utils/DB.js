import { default as GUtils } from '../../../utils/GUtils';

const { Datastore, path, gui } = GUtils.globals();

class DB {
  static remove(db, data, opts = {}) {
    return new Promise((resolve, reject) => {
      if (!db || !data) {
        reject({ message: 'required parameters missing' });
      } else {
        db.remove(data, opts, (err, numRemoved) => {
          if (err) { reject(err); }

          resolve(numRemoved);
        });
      }
    });
  }

  static find(db, data) {
    return new Promise((resolve, reject) => {
      if (!db || !data) {
        reject({ message: 'required parameters missing' });
      } else {
        db.find(data, (err, docs) => {
          if (err) { reject(err); }

          resolve(docs);
        });
      }
    });
  }

  static update(db, query, update, opts = {}) {
    return new Promise((resolve, reject) => {
      if (!db || !query || !update) {
        reject({ message: 'required parameters missing' });
      } else {
        db.update(query, update, opts, (err, numReplaced) => {
          if (err) { reject(err); }
          console.log('updated record', numReplaced);

          resolve(numReplaced);
        });
      }
    });
  }

  static insert(db, data) {
    return new Promise((resolve, reject) => {
      if (!db || !data) {
        reject({ message: 'required parameters missing' });
      } else {
        db.insert(data, (err, newDocs) => {
          if (err) { reject(err); }

          resolve(newDocs);
        });
      }
    });
  }

  constructor() {
    const db = {};
    const dbs = ['settings', 'shows'];

    dbs.forEach((currentDb) => {
      if (!db[currentDb]) {
        db[currentDb] = new Datastore({
          autoload: true,
          filename: path.join(gui.App.dataPath, `${currentDb}.db`),
        });
      }
    });

    this.db = db;
    this.dbs = dbs;
  }

  import(data) {
    console.log('DB import', data);
    const { db, dbs } = this;
    const all = [];
    dbs.forEach((currentDb, idx) => {
      all.push(
        DB.remove(db[currentDb], {}, { multi: true }),
        DB.insert(db[currentDb], data[idx])
      );
    });

    return Promise.all(all);
  }

  export() {
    console.log('DB export');
    const { db, dbs } = this;
    const all = [];
    dbs.forEach((currentDb) => {
      all.push(DB.find(db[currentDb], {}));
    });

    return Promise.all(all);
  }

  getDb(name) {
    const { db } = this;
    return db[name] ? db[name] : db;
  }
}

export default DB;
