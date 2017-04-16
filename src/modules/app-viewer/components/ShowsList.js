import React from 'react';

// TODO: test implementation - add to utility class
const concatUnique = (...arrs) => [...new Set([].concat(...arrs))];

const ShowsList = (props) => {
  console.log('ShowsList::', props);
  const { shows } = props;

  if (shows.length) {
    let allTags = [];
    const lis = shows.map((show, idx) => {

      // TODO: maybe move/use this data in the Menu class
      allTags = concatUnique(
        allTags,
        (show.tags || []).map(t => t.text),
      );
      return (
        <li key={idx}>
          <p>{show.name}</p>
        </li>
      );
    });

    console.log('allTags', allTags);

    return <ul>{ lis }</ul>;
  }

  return <div>no shows</div>;
};

ShowsList.propTypes = {
  shows: React.PropTypes.arrayOf(React.PropTypes.shape()),
};

export default ShowsList;
