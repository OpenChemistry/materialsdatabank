import React, { Component } from 'react';

import { connect } from 'react-redux'

import SearchResults from '../../components/searchresults';
import selectors from '../../redux/selectors';

class SearchResultsContainer extends Component {
  render = () => {
    const {results} = this.props;
    return (
      <SearchResults results={results}/>
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

export default connect(mapStateToProps)(SearchResultsContainer)
