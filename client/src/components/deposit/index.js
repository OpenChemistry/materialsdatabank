import React, { Component } from 'react';
import { reduxForm, reset, SubmissionError} from 'redux-form'

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import ClearIcon from '@material-ui/icons/Clear';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';

import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import _ from 'lodash'

import { loadDatasetById } from '../../redux/ducks/datasets';
import { loadReconstructions } from '../../redux/ducks/reconstructions';
import { loadProjections } from '../../redux/ducks/projections';
import { upload } from '../../redux/ducks/upload'
import selectors from  '../../redux/selectors'
import { setProgress } from '../../redux/ducks/app';

import PageHead from '../page-head';
import PageBody from '../page-body';

import JsonPopulate from './json';
import { dataCollectionFields, renderFormFields, reconstructionFields, generalInformationFields } from './fields';

const style = (theme) => (
  {
    field: {
      width: '100%',
      display: 'flex',
      marginTop: 3 * theme.spacing.unit,
    },
    divider: {
      marginTop:  4 * theme.spacing.unit,
    },
    dividerLine: {
      marginBottom: 2 * theme.spacing.unit
    },
    textField: {
      flexGrow: 1
    },
    button: {
      marginLeft: theme.spacing.unit
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }
)

class Deposit extends Component {

  constructor(props) {
    super(props);

    const { create, dataSet, dataSetId, dispatch } = props;
    if (!create && !dataSet) {
      dispatch(loadDatasetById(dataSetId));
      dispatch(loadProjections(dataSetId));
      dispatch(loadReconstructions(dataSetId));
    }
  }

  reset = () => {
    this.props.dispatch(reset('deposit'));
  }

  updateFieldsFromJson = (values) => {
    const { change } = this.props;
    for (let key of Object.keys(values)) {
      const val = Array.isArray(values[key]) ? JSON.stringify(values[key]) : values[key];
      change(key, val);
    }
  }

  deposit = (values, dispatch) => {
  
    const { create, dataSetId } = this.props;
    const actionCreator = create ? upload : upload;

    dispatch(setProgress(true));

    let depositPromise = new Promise((resolve, reject) => {
      dispatch(actionCreator({...values, dataSetId, resolve, reject}));
    }).then((dataSet) =>{
      dispatch(setProgress(false));
      const id = dataSet._id;
      dispatch(push(`/dataset/${id}`));
    }).catch((err) => {
      if (_.has(err, 'response.data.message')) {
        throw new SubmissionError({_error: err.response.data.message});
      } else {
        throw new SubmissionError({_error: 'An error has occurred while uploading the dataset'});
      }
    });
    return depositPromise;
  }

  render = () => {
    const {handleSubmit, pristine, submitting, invalid, error, classes, create} = this.props;

    const generalInformationForm = renderFormFields(generalInformationFields(create));
    const dataCollectionForm = renderFormFields(dataCollectionFields(create));
    const reconstructionForm = renderFormFields(reconstructionFields(create));

    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            {create ? 'Deposit a new structure' : 'Edit structure'}
          </Typography>
          { !this.props.isLoggedIn &&
          <Typography variant="subheading" color="error">
            You need to login before depositing a new material structure.
          </Typography>
          }
        </PageHead>
        { this.props.isLoggedIn &&
        <PageBody>
          <Card>
            <form onSubmit={handleSubmit(this.deposit)}>
              <CardContent>
                <Typography variant="title" color="textPrimary" gutterBottom>
                  General Information
                </Typography>
                <Divider className={classes.dividerLine}/>
                {generalInformationForm}
                <JsonPopulate onJsonParsed={this.updateFieldsFromJson}/>

                <Typography className={classes.divider} variant="title" color="textPrimary" gutterBottom>
                  Data collection and processing
                </Typography>
                <Divider className={classes.dividerLine}/>
                {dataCollectionForm}

                <Typography className={classes.divider} variant="title" color="textPrimary" gutterBottom>
                  Reconstruction and refinement
                </Typography>
                <Divider/>
                {reconstructionForm}

                <Typography color='error'>{error}</Typography>
              </CardContent>
              <CardActions className={classes.actions}>
                <Button
                  variant="raised"
                  disabled={pristine || submitting || invalid}
                  type='submit'
                  color='primary'
                >
                  <OpenInBrowserIcon/>
                  {create ? 'Deposit' : 'Save'}
                </Button>
                <Button
                  variant="raised"
                  disabled={pristine || submitting}
                  color='primary'
                  onClick={() => this.reset()}
                >
                  <ClearIcon/>
                  Clear
                </Button>
              </CardActions>
            </form>
          </Card>
        </PageBody>
        }
      </div>
    );
  }
}

function mapStateToPropsDeposit(state, ownProps) {
  let dataSet = null;
  let dataSetId = null;
  let reconstruction = null;
  let projection = null;
  const create = ownProps.match.params.action === 'deposit';
  let initialValues = { create };
  if (!create) {
    dataSetId = ownProps.match.params.id;
    dataSet = selectors.datasets.getDatasetById(state, dataSetId);
    let reconstructions = selectors.reconstructions.getReconstructionsByDataSetId(state, dataSetId);
    if (!_.isNil(reconstructions) && reconstructions.length > 0) {
      reconstruction = reconstructions[0];
    }
    let projections = selectors.projections.getProjectionsByDataSetId(state, dataSetId);
    if (!_.isNil(projections) && projections.length > 0) {
      projection = projections[0];
    }
    initialValues = {...initialValues, ...((values) => {
      // Convert the model data into suitable form data
      if (_.has(values, 'authors')) {
        values['authors'] = values['authors'].join(' and ');
      }
      const arrayFields = [
        'volumeSize',
        'bFactor',
        'hFactor',
        'axisConvention',
        'tiltRange'
      ]
      for (let field of arrayFields) {
        if (_.has(values, field)) {
          values[field] = JSON.stringify(values[field]);
        }
      }
      return values;
    })({...dataSet, ...projection, ...reconstruction})};
  }

  let error = selectors.upload.getError(state);

  const me = selectors.girder.getMe(state);

  let props = {
    isLoggedIn: !_.isNil(me),
    create,
    dataSet,
    reconstruction,
    dataSetId,
    initialValues,
    error
  };

  return props;
}

Deposit = withStyles(style)(Deposit);
Deposit = reduxForm({
  form: 'deposit',
  destroyOnUnmount: false,
  enableReinitialize: true
})(Deposit)
Deposit = connect(mapStateToPropsDeposit)(Deposit)

export default Deposit;
