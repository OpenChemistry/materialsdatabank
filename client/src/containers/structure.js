import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { loadStructures } from '../redux/ducks/structures'
import Structure from '../components/structure'
import selectors from '../redux/selectors'

class StructureContainer extends Component {

  componentDidMount() {
    if (this.props._id != null) {
      this.props.dispatch(loadStructures(this.props._id));
    }
  }

  render() {
    return <Structure {...this.props} />;
  }
}

StructureContainer.propTypes = {
  _id: PropTypes.string,
  cjson: PropTypes.object
}

StructureContainer.defaultProps = {
  _id: null,
  cjson: null
}

function mapStateToProps(state, ownProps) {
  let structures = selectors.structures.getStructuresById(state);
  let props = {};
  if (ownProps._id != null && ownProps._id in structures) {

    // For now we only have a single structure, so just pick the first.
    const structure = structures[ownProps._id][0];
    props = {
        cjson: structure.cjson
    }
  }

  return props;
}

export default connect(mapStateToProps)(StructureContainer)
