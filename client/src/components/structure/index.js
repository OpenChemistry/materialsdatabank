import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Molecule3d from 'molecule-3d-for-react'
import _ from 'lodash'

import { symbols } from '../../elements'

var cjsonToModelData = (cjson) => {
  let modelData = {
      atoms: [],
      bonds: []
  }

  if (cjson == null) {
    return modelData
  }


  const atoms = cjson.atoms;
  for (let [i, element] of atoms.elements.number.entries()) {
    const coords = atoms.coords['3d'];
    const coordsIndex = i * 3;
    let positions = [coords[coordsIndex], coords[coordsIndex+1], coords[coordsIndex+2]];

    let atom = {
        elem: symbols[element],
        serial: i,
        positions,
    }

    modelData.atoms.push(atom);
  }

  const bonds = cjson.bonds;

  if (!_.isNil(bonds)) {
    for (let [i, order] of bonds.order.entries()) {
      const connections = bonds.connections.index;
      const connectionIndex = i*2;
      let bond = {
        atom1_index: connections[connectionIndex],
        atom2_index: connections[connectionIndex+1],
        bond_order: order
      }
      modelData.bonds.push(bond);
    }
  }

  return modelData;
}

class Structure extends Component {

  render() {
    return (
      <div>
        <Molecule3d
          modelData={ cjsonToModelData(this.props.cjson) }
          volume={null}
          style={{
            sphere: {
              scale: 0.69,
            },
          }}
          backgroundColor='#ffffff'
        />
      </div>
    );
  }
}

Structure.propTypes = {
  cjson: PropTypes.object
}

Structure.defaultProps = {
  cjson: null
}


export default Structure
