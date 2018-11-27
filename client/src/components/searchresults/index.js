import React, { Component } from 'react';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';

import SearchResult from '../searchresult'

import PageHead from '../page-head';
import PageBody from '../page-body';


class SearchResults extends Component {
  render = () => {
    let { results, title } = this.props;
    results = results || [];
    title = title || 'Search Results';
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            {title}
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
            {results.length} matches
          </Typography>
        </PageHead>
        <PageBody>
          <GridList
            cellHeight={'auto'}
            cols={2}
          >
            {results.map((dataset) => (
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

export default SearchResults;
