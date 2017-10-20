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

  if (id != null) {
    const dataset = selectors.datasets.getDatasetById(state, id);
    if (dataset !== null) {
      // Avoid overriding the id, it could be a slug. TODO be more consistent about
      // where we use slug vs ids.
      const {_id, ...dataSetProps} = dataset;
      props = {...props, ...dataSetProps}
    }
  }

  return props;
}

export default connect(mapStateToProps)(DatasetContainer)
