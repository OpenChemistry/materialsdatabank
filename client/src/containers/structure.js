import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { loadStructures } from '../redux/ducks/structures'
import selectors from '../redux/selectors'
import { wc } from '../utils/webcomponent';

class StructureContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      rotate: true
    };
  }

  componentDidMount() {
    if (this.props._id != null) {
      this.props.dispatch(loadStructures(this.props._id));
    }
  }

  onMouseDown() {
    this.setState({
      rotate: false
    });
  }

  render() {
  return (
    <div style={{width: '100%', height: '100%', position: 'relative'}}
         onMouseDown={() => this.onMouseDown()} >
      <oc-molecule-moljs
        ref={wc(
          // Events
          {},
          // Props
          {
            rotate: this.state.rotate,
            cjson: this.props.cjson,
            options: {
              style: {
                stick: {
                  radius: 0
                },
                sphere: {
                  scale: 0.7
                }
              }
            }
          }
        )}
      />
    </div>
    );
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
