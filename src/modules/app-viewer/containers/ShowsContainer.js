import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ShowsList } from '../components';
import { default as DB } from '../utils/DB';
import {
  setShows,
} from '../actions';

const mapStateToProps = state => ({
  shows: state.shows,
});

const mapDispatchToProps = dispatch => ({
  doSetShows: shows => dispatch(setShows(shows)),
});

class ShowsContainer extends Component {
  componentDidMount() {
    const dbInst = new DB();
    const showsDb = dbInst.getDb(DB.SHOWS_DB);

    // get a list of all shows
    DB.find(showsDb, {})
      .then((docs) => {
        this.props.doSetShows(docs);
        console.log('ShowsContainer::', docs);
      });
  }

  render() {
    return <ShowsList {...this.props.shows} />;
  }
}

ShowsContainer.propTypes = {
  doSetShows: PropTypes.func,
  shows: PropTypes.shape(),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowsContainer);
