const gui = window.require('nw.gui');
const win = gui.Window.get();

export default class GUtils {
  static globals() {
    return {
      gui,
      win,
    };
  }
}
