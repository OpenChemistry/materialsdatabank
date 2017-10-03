import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { loadTomoById } from '../redux/ducks/tomos'
import { loadStructures } from '../redux/ducks/structures'
import Tomo from '../components/tomo'
import selectors from '../redux/selectors'

class TomoContainer extends Component {

  componentDidMount() {
    if (this.props._id != null) {
      this.props.dispatch(loadTomoById(this.props._id));
      this.props.dispatch(loadStructures(this.props._id));
    }
  }

  render() {
    return <Tomo {...this.props} />;
  }
}

TomoContainer.propTypes = {
  id: PropTypes.string,
  inchikey: PropTypes.string
}

TomoContainer.defaultProps = {
  id: null,
  inchikey: null
}

function mapStateToProps(state, ownProps) {
  let id = ownProps.match.params.id || null;
  let props = {
      _id: id
  }

  let tomos = selectors.tomos.getTomosById(state);
  if (id != null && id in tomos) {
    const tomo = tomos[id];
    props = {...tomo}
  }

  return props;
}

export default connect(mapStateToProps)(TomoContainer)
