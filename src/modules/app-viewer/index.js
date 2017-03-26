import React from 'react';
import { connect } from 'react-redux';
import { TitleBar } from './components';
import { default as DB } from './utils/DB';
import {
  toggleTitleBar,
} from './actions';

// TODO: remove this DB test
const d = new DB();
const showsDb = d.getDb(DB.SHOWS_DB);
// get a list of all shows
DB.find(showsDb, {})
  .then((docs) => {
    console.log('show entries', docs);
  });

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
        <div className="search-bar">
          <input type="text" />
        </div>
        <div className="shows">shows</div>
        <button
          onClick={props.handleTitleBarToggle}
        >
          Toggle Title Bar Visibility
        </button>
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
