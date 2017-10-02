import React, { Component } from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import { connect } from 'react-redux'

import TomoRecord from '../tomo'
import selectors from '../../redux/selectors';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
//    width: 500,
//    height: 450,
    overflowY: 'auto',
  },
};

class SearchResults extends Component {
  render = () => {
    return (
      <div style={styles.root}>
        <GridList
          cellHeight={'auto'}
          style={styles.gridList}
          cols={4}
        >
          {this.props.results.map((tomo) => (
            <GridTile
              key={tomo._id}
            >
              <TomoRecord name={tomo.paper}/>
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
