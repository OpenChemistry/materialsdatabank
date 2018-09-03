import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux'

import { loadDatasetById, toggleEditable } from '../../redux/ducks/datasets'
import selectors from '../../redux/selectors';
import { Button, Table, TableRow, TableCell, TableHead, TableBody } from '@material-ui/core';

class EditToggle extends Component {
  
  fetchDataSet = () => {
    const { dataset } = this.props;
    if (!_.isNil(dataset)) {
      this.props.dispatch(loadDatasetById(dataset._id));
    }
  }

  toggleEditable = () => {
    const {dataset, dispatch} = this.props;
    if ( _.isNil(dataset) ) {
      return;
    }
    let { _id, editable } = dataset;
    if (_.isNil(editable)) {
      editable = false;
    }

    this.props.dispatch(toggleEditable({id: _id, editable: !editable}));
  }

  render() {
    const { dataset } = this.props;
    if (!dataset) {
      return (null);
    }

    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{width: '100%'}}></TableCell>
              <TableCell>Toggle edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
              {dataset.editable ? 'Editing allowed' : 'Editing not allowed'}
              </TableCell>
              <TableCell>
                <Button variant="contained" size="small" onClick={this.toggleEditable}>
                  {dataset.editable ? 'Disable' : 'Enable'}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  let props = {
    dataset: null
  };

  if (!_.isNull(ownProps._id)) {
    let dataset = selectors.datasets.getDatasetById(state, ownProps._id);
    props['dataset'] = dataset;
  }

  return props;
}

export default connect(mapStateToProps)(EditToggle)
