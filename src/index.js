import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import devToolsEnhancer from 'remote-redux-devtools';
import { Provider } from 'react-redux';
import AppViewer from './modules/app-viewer';
import reducer from './modules/app-viewer/reducers';
import { default as GUtils } from './utils/GUtils';

require('./less/styles.less');

let store;
if (__DEV__) {
  // show developer tools
  GUtils.globals().win.showDevTools();
  store = createStore(reducer, devToolsEnhancer());
} else {
  store = createStore(reducer);
}

const App = () => (
  <Provider store={store}>
    <div>
      <AppViewer />
    </div>
  </Provider>
);

render(
  <App />,
  document.querySelector('.app-container')
);
