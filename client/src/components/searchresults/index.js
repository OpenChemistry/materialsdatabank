import React, { Component } from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import { connect } from 'react-redux'

import SearchResult from '../searchresult'
import selectors from '../../redux/selectors';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    overflowY: 'auto'
  },
};

class SearchResults extends Component {
  render = () => {
    return (
      <div style={styles.root}>
        <GridList
          cellHeight={'auto'}
          style={styles.gridList}
          cols={3}
        >
          {this.props.results.map((tomo) => (
            <GridTile
              key={tomo._id}
            >
              <SearchResult
                _id={tomo._id}
                title={tomo.title}
                authors={tomo.authors}
                imageFileId={tomo.imageFileId}
                atomicSpecies={tomo.atomicSpecies}
              />
            </GridTile>
          ))}
        </GridList>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let props = {
    results: selectors.tomos.getSearchResults(state),
  }

  let error = selectors.tomos.getSearchError(state);
  if (error != null) {
    console.error(error);
  }

  return props;
}

export default connect(mapStateToProps)(SearchResults)
