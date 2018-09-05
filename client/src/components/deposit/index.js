import React, { Component } from 'react';
import { TextField } from 'redux-form-material-ui'
import { reduxForm, Field, reset, SubmissionError} from 'redux-form'

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import ClearIcon from '@material-ui/icons/Clear';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';

import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import _ from 'lodash'
import filesize from 'filesize'

import { loadDatasetById } from '../../redux/ducks/datasets';
import { loadReconstructions } from '../../redux/ducks/reconstructions';
import { upload } from '../../redux/ducks/upload'
import selectors from  '../../redux/selectors'
import { setProgress } from '../../redux/ducks/app';

import PageHead from '../page-head';
import PageBody from '../page-body';

import './index.css'

const style = (theme) => (
  {
    field: {
      width: '100%',
      display: 'flex',
      marginBottom: 3 * theme.spacing.unit,
    },
    divider: {
      marginTop:  4 * theme.spacing.unit,
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

class FileInputField extends Component {

  fileInput;

  constructor(props) {
    super(props)
    this.state = {
      complete: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const complete = !_.isNil(nextProps.total) && !_.isNil(nextProps.progress) && nextProps.total === nextProps;

    this.setState({
      complete
    })

   }

  render = () => {
    const {classes} = this.props;
    const file = this.props.input.value;
    const name = file !== '' ? file.name : '';
    const size = file !== '' ? filesize(file.size) : '';
    const showProgress = this.props.progress > 0;

    return (
      <div className={classes.field}>
        <div className={classes.textField}>
          <TextField
            fullWidth
            disabled={true}
            value={file !== '' ?`${name} (${size})` : ''}
            label={this.props.label}
            onClick={() => {
              if (this.fileInput) {
                this.fileInput.click();
              }
            }}
          />

          <LinearProgress
            hidden={!showProgress}
            variant="determinate"
            value={this.state.complete ? 0 : 100 * this.props.progress / this.props.total}
          />
        </div>

        <Button
          disabled={this.props.disabled}
          className={classes.button}
          onClick={() => {
            if (this.fileInput) {
              this.fileInput.click();
            }
          }}
        >
          Select file
          <input
            ref={ref => {this.fileInput = ref;}}
            type="file"
            hidden
            onChange={(e) => this.props.input.onChange(e.target.files[0])}
          />
        </Button>
      </div>
    );
  }
}

function mapStateToPropsFileInputField(state, ownProps) {

  const upload = selectors.upload.getUploadByFile(state, ownProps.input.value);
  let props = {};
  if (!_.isNil(upload)) {
    let progress = upload.progress;
    let total = ownProps.input.value.size;

    props = {
        progress,
        total
    }
  }

  return props;
}

FileInputField = withStyles(style)(FileInputField);
FileInputField = connect(mapStateToPropsFileInputField)(FileInputField);

const validate = values => {
  const { create } = values;
  const errors = {}
  const requiredFields = [
    'title',
    'authors'
  ];
  if ( create ) {
    requiredFields.push('url');
    requiredFields.push('structureFile');
    requiredFields.push('reconstructionFile');
    requiredFields.push('projectionFile');
  }
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })

  // Validate arrays
  const arrayFields = {
    'volumeSize': [3],
    'bFactor': null,
    'hFactor': null,
    'axisConvention': [3, 3]
  }
  for (const [ field, size ] of Object.entries(arrayFields)) {
    if (values[ field ]) {
      try {
        let arr = JSON.parse(values[field]);
        if (Array.isArray(arr)) {
          if (size) {
            if (size[0] !== arr.length) {
              errors[ field ] = 'Provide an array with the right dimensions';
            } else {
              if (size[1]) {
                for (let a of arr) {
                  if (size[1] !== a.length) {
                    errors[ field ] = 'Provide an array with the right dimensions';
                  }
                }
              }
            }
          }
        } else {
          errors[ field ] = 'Provide a valid array';
        }
      } catch(e) {
        errors[ field ] = 'Provide a valid array';
      }
    }
  }

  return errors
}

class Deposit extends Component {

  constructor(props) {
    super(props);

    const { create, dataSet, dataSetId, dispatch } = props;
    if (!create && !dataSet) {
      dispatch(loadDatasetById(dataSetId));
      dispatch(loadReconstructions(dataSetId));
    }
  }

  reset = () => {
    this.props.dispatch(reset('deposit'));
  }

  deposit = (values, dispatch) => {

    const {
      structureFile,
      reconstructionFile,
      imageFile,
      projectionFile
    } = values;
  
    const { create, dataSetId } = this.props;
    const actionCreator = create ? upload : upload;
  
    if (!_.isNil(structureFile)) {
      structureFile.id = 'structureFile';
    }
    if (!_.isNil(reconstructionFile)) {
      reconstructionFile.id = 'reconstructionFile';
    }
    if (!_.isNil(imageFile)) {
      imageFile.id = 'imageFile';
    }
    if (!_.isNil(projectionFile)) {
      projectionFile.id = 'projectionFile';
    }
  
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

  onKeyDown = e => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      this.search();
    }
  }

  render = () => {
    const {handleSubmit, pristine, submitting, invalid, error, classes, create} = this.props;

    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            {create ? 'Deposit a new structure' : 'Edit structure'}
          </Typography>
          <Typography  color="inherit" variant="subheading" paragraph>
            We currently only accept the atomic structural information published in peer-reviewed journal.
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
                <Field
                  className={classes.field}
                  name="title"
                  component={TextField}
                  label="Title"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Field
                  className={classes.field}
                  name="authors"
                  component={TextField}
                  label='Authors ( "and" separated )'
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Field
                  className={classes.field}
                  name="url"
                  component={TextField}
                  label="DOI"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Field
                  className={classes.field}
                  name="imageFile"
                  component={FileInputField}
                  label='Image file ( Thumbnail for dataset )'
                  disabled={submitting}
                />
                <Field
                  className={classes.field}
                  name="structureFile"
                  component={FileInputField}
                  label={'Structure file ( XYZ )'}
                  hintText={'Structure file'}
                  disabled={submitting}
                />
                <Field
                  className={classes.field}
                  name="reconstructionFile"
                  component={FileInputField}
                  label={'Reconstruction file ( EMD format )'}
                  hintText={'Reconstruction file'}
                  disabled={submitting}
                />
                <Field
                  className={classes.field}
                  name="projectionFile"
                  component={FileInputField}
                  label={'Projection file ( EMD format )'}
                  hintText={'Projection file'}
                  disabled={submitting}
                />
                <Typography className={classes.divider} variant="subheading" color="textPrimary">
                  Reconstruction file metadata
                </Typography>

                <Tooltip
                  title='Resolution of the projections. It should have units consistent with the atomic coordinates of the model (Usually px/Angstrom)'
                >
                  <Field
                    className={classes.field}
                    name='resolution'
                    component={TextField}
                    label='Resolution'
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Tooltip>

                <Tooltip
                  title='This value should be changed based on the pixel size and B factor.'
                >
                  <Field
                    className={classes.field}
                    name='cropHalfWidth'
                    component={TextField}
                    label='Crop Half Width'
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Tooltip>

                <Tooltip
                  title='The number of pixels in the reconstructed volume along each direction.'
                >
                  <Field
                    className={classes.field}
                    name='volumeSize'
                    component={TextField}
                    label='Number of pixels in each direction'
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder='Example: [256, 256, 256]'
                  />
                </Tooltip>

                <Tooltip
                  title='Projection direction during the GENIFRE iteration (integer). 0 = x, 1 = y, 2 = z'
                >
                  <Field
                    className={classes.field}
                    name='zDirection'
                    component={TextField}
                    label='Z Direction'
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Tooltip>

                <Tooltip
                  title='B factors array, one value per atomic species. The B factor accounts for the electron probe size (50 pm), the thermal motions, and the reconstruction error for different chemical elements.'
                >
                  <Field
                    className={classes.field}
                    name='bFactor'
                    component={TextField}
                    label='B Factor Array'
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Tooltip>

                <Tooltip
                  title='H factors array, one value per atomic species. The H factor accounts for electron scattering cross sections for different atomic species in the given experimental conditions.'
                >
                  <Field
                    className={classes.field}
                    name='hFactor'
                    component={TextField}
                    label='H Factor Array'
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Tooltip>

                <Tooltip
                  title='GENFIRE rotation axis direction for phi, theta, psi directions, respectively.'
                >
                  <Field
                    className={classes.field}
                    name='axisConvention'
                    component={TextField}
                    label='Axis Convention'
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder='Example: [[1, 0, 0], [0, 1, 0], [0, 0, 1]]'
                  />
                </Tooltip>
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
  const create = ownProps.match.params.action === 'deposit';
  let initialValues = { create };
  if (!create) {
    dataSetId = ownProps.match.params.id;
    dataSet = selectors.datasets.getDatasetById(state, dataSetId);
    let reconstructions = selectors.reconstructions.getReconstructionsByDataSetId(state, dataSetId);
    if (!_.isNil(reconstructions) && reconstructions.length > 0) {
      reconstruction = reconstructions[0];
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
        'axisConvention'
      ]
      for (let field of arrayFields) {
        if (_.has(values, field)) {
          values[field] = JSON.stringify(values[field]);
        }
      }
      return values;
    })({...dataSet, ...reconstruction})};
  }

  let error = selectors.upload.getError(state);

  const me = selectors.girder.getMe(state);

  let props = {
    isLoggedIn: !_.isNil(me),
    create,
    dataSet,
    reconstruction,
    dataSetId,
    initialValues
  };

  return props;
}

Deposit = withStyles(style)(Deposit);
Deposit = reduxForm({
  form: 'deposit',
  destroyOnUnmount: false,
  enableReinitialize: true,
  validate
})(Deposit)
Deposit = connect(mapStateToPropsDeposit)(Deposit)

export default Deposit;
