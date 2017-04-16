import React from 'react';
import PropTypes from 'prop-types';

const ShowsList = (props) => {
  console.log('ShowsList::', props);
  const { shows } = props;
  let data;

  if (shows.length) {
    const lis = shows.map((show, idx) => (
      <li key={idx}>
        <p>{show.name}</p>
      </li>
    ));

    data = <ul>{ lis }</ul>;
  } else {
    data = <div>no shows</div>;
  }

  return <div className="shows">{data}</div>;
};

ShowsList.propTypes = {
  shows: PropTypes.arrayOf(PropTypes.shape()),
};

export default ShowsList;
