import React from 'react'; // , { Component }
import { render } from 'react-dom';
import { createStore } from 'redux'; // combineReducers
import { Provider } from 'react-redux';
import AppViewer from './modules/app-viewer';
import reducer from './modules/app-viewer/reducers';
import { default as DevTools } from './containers/DevTools';
import { default as GUtils } from './utils/GUtils';

require('./less/styles.less');

let store;
const tools = __DEV__ ? <DevTools /> : null;
if (__DEV__) {
  GUtils.globals().win.showDevTools();
  store = createStore(reducer, DevTools.instrument());
} else {
  store = createStore(reducer);
}

const App = () => (
  <Provider store={store}>
    <div>
      { tools }
      <AppViewer />
    </div>
  </Provider>
);

render(
  <App />,
  document.querySelector('.app-container')
);
