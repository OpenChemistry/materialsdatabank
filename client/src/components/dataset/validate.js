import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux'

import { loadDatasetById } from '../../redux/ducks/datasets'
import { loadJob } from '../../redux/ducks/jobs';
import { validateDataSet } from '../../redux/ducks/upload';
import selectors from '../../redux/selectors';
import { Button, Table, TableRow, TableCell, TableHead, TableBody } from '@material-ui/core';

const INACTIVE = 'INACTIVE';
const QUEUED = 'QUEUED';
const RUNNING = 'RUNNING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';
const CANCELED = 'CANCELED';

const JOB_STATUS = {
  0: INACTIVE,
  1: QUEUED,
  2: RUNNING,
  3: SUCCESS,
  4: ERROR,
  5: CANCELED
}

const STATUS_LABEL = {
  INACTIVE: 'Inactive',
  QUEUED: 'Queued',
  RUNNING: 'Running',
  SUCCESS: 'Success',
  ERROR: 'Error',
  CANCELED: 'Canceled'
}

const CAN_RESTART = {
  INACTIVE: false,
  QUEUED: false,
  RUNNING: false,
  SUCCESS: true,
  ERROR: true,
  CANCELED: true
}

const STATUS_COLOR = {
  INACTIVE: '#FFC107',
  QUEUED: '#FFC107',
  RUNNING: '#FFC107',
  SUCCESS: '#4CAF50',
  ERROR: '#F44336',
  CANCELED: '#F44336'
}

const getR1 = (dataset) => {
  if (
    !_.isNil(dataset) &&
    !_.isNil(dataset.validation) &&
    !_.isNil(dataset.validation.r1)
  ) {
    return dataset.validation.r1;
  }
  return null;
}

const getJobId = (dataset) => {
  if (
    !_.isNil(dataset) &&
    !_.isNil(dataset.validation) &&
    !_.isNil(dataset.validation.jobId)
  ) {
    return dataset.validation.jobId;
  }
  return null;
}

class ValidateTable extends Component {
  
  fetchJobInfo = () => {
    const { dataset } = this.props;
    const jobId = getJobId(dataset);
    if (!_.isNil(jobId)) {
      this.props.dispatch(loadJob(jobId));
    }
  }

  fetchDataSet = () => {
    const { dataset } = this.props;
    if (!_.isNil(dataset)) {
      this.props.dispatch(loadDatasetById(dataset._id));
    }
  }

  startValidation = () => {
    const { dataset } = this.props;
    if (!_.isNil(dataset)) {
      this.props.dispatch(validateDataSet(dataset._id));
    }
  }

  render() {
    const { dataset, job } = this.props;
    const jobId = getJobId(dataset);
    const hasJobId = !_.isNil(jobId);
    if (hasJobId && _.isNil(job)) {
      // If the dataset has a job id, but no job matching was already in the store,
      // dispatch an action to fetch it
      this.fetchJobInfo();
    }

    let canRestart = !hasJobId;
    let label = null;
    let result = getR1(dataset);
    let color = null;
    if (!_.isNil(job)) {
      const status = JOB_STATUS[job.status];
      canRestart = CAN_RESTART[status];
      label = STATUS_LABEL[status];
      color = STATUS_COLOR[status];
      if (_.isNil(getR1(dataset)) && status === SUCCESS) {
        // If job is completed, but the dataset doesn't have an r1 value,
        // it needs to be fetched from the server
        this.fetchDataSet();
      }
    }

    // if (!_.isNil(dataset)) {
    //   result = dataset.validation.r1 || null;
    // }

    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell  style={{width: '100%'}}></TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Refresh status</TableCell>
              <TableCell>Start validation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                R1 Validation
              </TableCell>
              <TableCell>
                {result ? result.toFixed(6) : null}
              </TableCell>
              <TableCell>
                <div style={{color}}>
                  {label}
                </div>
              </TableCell>
              <TableCell>
                <Button variant="contained" size="small" disabled={!hasJobId} onClick={this.fetchJobInfo}>
                  Refresh
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="contained" size="small" disabled={!canRestart} onClick={this.startValidation}>
                  {hasJobId ? 'Restart' : 'Start'}
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
    dataset: null,
    job: null
  };

  if (!_.isNull(ownProps._id)) {
    let dataset = selectors.datasets.getDatasetById(state, ownProps._id);
    props['dataset'] = dataset;
    let jobId = getJobId(dataset);
    if (!_.isNil(jobId)) {
      let job = selectors.jobs.getJob(state, jobId);
      props['job'] = job;
    }
  }

  return props;
}

export default connect(mapStateToProps)(ValidateTable)
