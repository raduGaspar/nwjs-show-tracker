const Datastore = window.require('nedb');
const path = window.require('path');
const fs = window.require('fs');
const gui = window.require('nw.gui');
const win = gui.Window.get();
const dirname = path.dirname();
const urls = {
  omdbapi: 'http://www.omdbapi.com/',
};

export default class GUtils {
  static globals() {
    return {
      Datastore,
      dirname,
      fs,
      gui,
      path,
      urls,
      win,
    };
  }
}
