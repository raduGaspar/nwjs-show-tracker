import React from 'react';
import { connect } from 'react-redux';
import { default as ShowsContainer } from './containers/ShowsContainer';
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
    <div className="search-bar">
      <input type="text" placeholder="Filter / Add" />
    </div>
    <div className="content">
      <div className="menu">
        app menu
        <button
          onClick={props.handleTitleBarToggle}
        >
          Toggle Title Bar Visibility
        </button>
      </div>
      <div className="main">
        <div className="shows">
          <ShowsContainer />
        </div>
      </div>
    </div>
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
