import React from 'react';
import PropTypes from 'prop-types';

const ShowsList = (props) => {
  console.log('ShowsList::', props);
  const { shows } = props;

  if (shows.length) {
    const lis = shows.map((show, idx) => (
      <li key={idx}>
        <p>{show.name}</p>
      </li>
    ));

    return <ul>{ lis }</ul>;
  }

  return <div>no shows</div>;
};

ShowsList.propTypes = {
  shows: PropTypes.arrayOf(PropTypes.shape()),
};

export default ShowsList;
