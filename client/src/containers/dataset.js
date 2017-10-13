import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { loadDatasetById } from '../redux/ducks/datasets'
import { loadReconstructions } from '../redux/ducks/reconstructions'
import Dataset from '../components/dataset'
import selectors from '../redux/selectors'

class DatasetContainer extends Component {

  componentDidMount() {
    if (this.props._id != null) {
      this.props.dispatch(loadDatasetById(this.props._id));
      this.props.dispatch(loadReconstructions(this.props._id));
    }
  }

  render() {
    return <Dataset {...this.props} />;
  }
}

DatasetContainer.propTypes = {
  id: PropTypes.string,
  inchikey: PropTypes.string
}

DatasetContainer.defaultProps = {
  id: null
}

function mapStateToProps(state, ownProps) {
  let id = ownProps.match.params.id || null;
  let props = {
      _id: id
  }

  let datasets = selectors.datasets.getDatasetsById(state);
  if (id != null && id in datasets) {
    const dataset = datasets[id];
    props = {...dataset}
  }

  return props;
}

export default connect(mapStateToProps)(DatasetContainer)
