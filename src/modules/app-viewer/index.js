import React from 'react';
import { connect } from 'react-redux';
import Menu from './components/menu/Menu';

import {
  toggleMenu,
} from './actions';

const mapStateToProps = state => ({
  application: state.application,
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  handleMenuToggle: () => {
    dispatchProps.doMenuToggle();
  },
});

const mapDispatchToProps = dispatch => ({
  doMenuToggle: params => dispatch(toggleMenu(params)),
});

const AppViewer = props => (
  <div>
    <Menu />
    <div className="content">React Boilerplate: Hello World</div>
    <button
      onClick={
        () => props.handleMenuToggle()
      }
    >
      Toggle Menu Visibility
    </button>
  </div>
);

// define React.PropTypes here
AppViewer.propTypes = {
  handleMenuToggle: React.PropTypes.func,
};


export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(AppViewer);
