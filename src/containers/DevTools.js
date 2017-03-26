/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

// you can hide the devtools by default by setting
// defaultIsVisible={false}
const DevTools = createDevTools(
  <DockMonitor
    defaultIsVisible={false}
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
  >
    <LogMonitor theme="monokai" />
  </DockMonitor>
);

export default DevTools;
