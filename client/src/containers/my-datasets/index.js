import React, { Component } from 'react';
import { connect } from 'react-redux';

import { searchDatasetsByMe } from '../../redux/ducks/datasets';
import { getSearchResults } from '../../redux/selectors/datasets';
import { getMe } from '../../redux/selectors/girder';
import SearchResults from '../../components/searchresults';

class MyDataSetsComponent extends Component {
  componentDidMount() {
    const { dispatch, me } = this.props;
    dispatch(searchDatasetsByMe(me));
  }

  render() {
    const {datasets} = this.props;
    return(
      <SearchResults results={datasets} title='My Datasets'/>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    me: getMe(state),
    datasets: getSearchResults(state)
  }
}

MyDataSetsComponent = connect(mapStateToProps)(MyDataSetsComponent);

export default MyDataSetsComponent;
