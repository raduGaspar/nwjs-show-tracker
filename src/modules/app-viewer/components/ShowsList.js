import React from 'react';

const ShowsList = (props) => {
  console.log('ShowsList::', props);
  const { shows } = props;
  if (shows.length) {
    return <ul>{ shows.map((show, idx) => (<li key={idx}><p>{show.name}</p></li>)) } </ul>;
  }

  return <div>no shows</div>;
};

ShowsList.propTypes = {
  shows: React.PropTypes.arrayOf(React.PropTypes.shape()),
};

export default ShowsList;
