import React, { Component } from 'react';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux'

import SearchResult from '../searchresult'
import selectors from '../../redux/selectors';

import PageHead from '../page-head';
import PageBody from '../page-body';


class SearchResults extends Component {
  render = () => {
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Search Results
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
            {this.props.results.length} matches
          </Typography>
        </PageHead>
        <PageBody>
          <GridList
            cellHeight={'auto'}
            cols={2}
          >
            {this.props.results.map((dataset) => (
              <GridListTile
                key={dataset._id}
              >
                <SearchResult
                  _id={dataset._id}
                  slug={dataset.slug}
                  public={dataset.public}
                  title={dataset.title}
                  authors={dataset.authors}
                  imageFileId={dataset.imageFileId}
                  atomicSpecies={dataset.atomicSpecies}
                />
              </GridListTile>
            ))}
          </GridList>
        </PageBody>
      </div>
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
