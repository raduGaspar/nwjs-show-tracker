import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  toggleTitleBar,
} from '../actions';

// TODO: test implementation - add to utility class
const concatUnique = (...arrs) => [...new Set([].concat(...arrs))];

const mapStateToProps = state => ({
  shows: state.shows,
});

const mapDispatchToProps = dispatch => ({
  doTitleBarToggle: () => dispatch(toggleTitleBar()),
});

// const mergeProps = (stateProps, dispatchProps, ownProps) => ({
//   ...ownProps,
//   ...stateProps,
//   ...dispatchProps,
//   handleTitleBarToggle: () => {
//     dispatchProps.doTitleBarToggle();
//   },
// });

const Menu = (props) => {
  console.log('Menu::', props);
  const { shows } = props.shows;

  if (shows.length) {
    let allTags = [];
    shows.forEach((show) => {
      allTags = concatUnique(
        allTags,
        (show.tags || []).map(t => t.text)
      );
    });

    const lis = allTags.map((tag, idx) => <li key={idx}>{tag}</li>);

    return (
      <div className="menu">
        <button
          onClick={props.doTitleBarToggle}
        >
          Toggle Title Bar Visibility
        </button>
        <ul>{ lis }</ul>
      </div>
    );
  }

  return <div>no tags</div>;
};

Menu.propTypes = {
  shows: PropTypes.shape(),
  doTitleBarToggle: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);

