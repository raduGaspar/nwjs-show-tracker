import React from 'react';
import { default as ShowsContainer } from './containers/ShowsContainer';
import { TitleBar, Menu } from './components';

const AppViewer = () => (
  <div>
    <TitleBar />
    <div className="search-bar">
      <input type="text" placeholder="Filter / Add" />
    </div>
    <div className="content">
      <Menu />
      <div className="main">
        <div className="shows">
          <ShowsContainer />
        </div>
      </div>
    </div>
  </div>
);

export default AppViewer;
