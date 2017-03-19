import React from 'react';
import { connect } from 'react-redux';
import { TitleBar } from './components';

import {
  toggleTitleBar,
} from './actions';

const mapStateToProps = state => ({
  application: state.application,
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  handleTitleBarToggle: () => {
    dispatchProps.doTitleBarToggle();
  },
});

const mapDispatchToProps = dispatch => ({
  doTitleBarToggle: params => dispatch(toggleTitleBar(params)),
});

const AppViewer = props => (
  <div>
    <TitleBar />
    <div className="content">
      <div className="menu">app menu</div>
      <div className="main">
        <div className="search-bar">search / filter / add bar</div>
        <div className="shows">shows</div>
      </div>
    </div>
    <button
      onClick={props.handleTitleBarToggle}
    >
      Toggle Title Bar Visibility
    </button>
  </div>
);

// define React.PropTypes here
AppViewer.propTypes = {
  handleTitleBarToggle: React.PropTypes.func,
};


export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(AppViewer);
