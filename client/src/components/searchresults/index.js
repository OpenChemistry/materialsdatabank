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

        <GridList
          cellHeight={'auto'}
          style={styles.gridList}
          cols={3}
        >
          {this.props.results.map((dataset) => (
            <GridTile
              key={dataset._id}
            >
              <SearchResult
                _id={dataset._id}
                title={dataset.title}
                authors={dataset.authors}
                imageFileId={dataset.imageFileId}
                atomicSpecies={dataset.atomicSpecies}
              />
            </GridTile>
          ))}
        </GridList>
    );
  }
}

function mapStateToProps(state) {
  let props = {
    results: selectors.datasets.getSearchResults(state),
  }

  let error = selectors.datasets.getSearchError(state);
  if (error != null) {
    console.error(error);
  }

  return props;
}

export default connect(mapStateToProps)(SearchResults)
