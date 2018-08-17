import React, { Component } from 'react';
import { TextField } from 'redux-form-material-ui'
import { reduxForm, Field, reset} from 'redux-form'

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import _ from 'lodash'
import filesize from 'filesize'

import { upload } from '../../redux/ducks/upload'
import selectors from  '../../redux/selectors'
import { clearNewDataSet } from '../../redux/ducks/upload';
import { setProgress } from '../../redux/ducks/app';

import PageHead from '../page-head';
import PageBody from '../page-body';

import './index.css'

const style = (theme) => (
  {
    field: {
      width: '100%',
      display: 'flex',
      marginBottom: 2 * theme.spacing.unit,
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
FileInputField = connect(mapStateToPropsFileInputField)(FileInputField)


const deposit = (values, dispatch) => {

  const {
    title,
    authors,
    slug,
    url,
    structureFile,
    reconstructionFile,
    imageFile,
    projectionFile
  } = values;

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

  return new Promise((resolve, reject) => {
    dispatch(upload(title, authors, url, slug, structureFile,
        reconstructionFile, imageFile, projectionFile, resolve, reject));
  }).then(() => dispatch(setProgress(false)));

//    this.props.dispatch(push('/'));
}

const validate = values => {
  const errors = {}
  const requiredFields = [ 'title', 'authors', 'structureFile', 'url']
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })

  return errors
}

class Deposit extends Component {

  constructor(props) {
    super(props)
  }

  componentWillReceiveProps = (nextProps) => {
    if (!_.isNil(nextProps.newDataSet)) {
      const id = nextProps.newDataSet._id;
      this.props.dispatch(clearNewDataSet());
      this.props.dispatch(push(`dataset/${id}`));
    }
  }

  reset = () => {
    this.props.dispatch(reset('deposit'));
  }

  onKeyDown = e => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      this.search();
    }
  }

  render = () => {
    const {handleSubmit, pristine, submitting, invalid, classes} = this.props;

    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Deposit a new structure
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
            <form onSubmit={handleSubmit(deposit)}>
              <CardContent>
                <Field
                  className={classes.field}
                  name="title"
                  component={TextField}
                  label="Title"
                />
                <Field
                  className={classes.field}
                  name="authors"
                  component={TextField}
                  label='Authors ( "and" separated )'
                />
                <Field
                  className={classes.field}
                  name="slug"
                  component={TextField}
                  label="URL slug ( human readable identifier )"
                  error={!!this.props.slugError}
                  helperText={this.props.slugError}
                />
                <Field
                  className={classes.field}
                  name="url"
                  component={TextField}
                  label="DOI"
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
                  label={'Reconstruction file ( EMD or TIFF )'}
                  hintText={'Reconstruction file'}
                  disabled={submitting}
                />
                <Field
                  className={classes.field}
                  name="projectionFile"
                  component={FileInputField}
                  label={'Projection file ( EMD or TIFF )'}
                  hintText={'Projection file'}
                  disabled={submitting}
                />
              </CardContent>
              <CardActions className={classes.actions}>
                <Button
                  variant="raised"
                  disabled={pristine || submitting || invalid}
                  type='submit'
                  color='primary'
                >
                  <SearchIcon/>
                  Deposit
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

  const newDataSet = selectors.upload.getNewDataSet(state);
  let error = selectors.upload.getError(state);
  console.log(error)

  const me = selectors.girder.getMe(state);

  let props = {
    isLoggedIn: !_.isNil(me)
  };
  let slugError = '';
  if (_.has(error, 'response')) {
    error = error.response;
    if (error.status === 400 && error.data.field === 'slug') {
      slugError = 'This identifier has already been taken.';
    }
  }
  props['slugError'] = slugError;

  if (!_.isNil(newDataSet)) {
    props['newDataSet'] = newDataSet;
  }

  return props;
}

Deposit = withStyles(style)(Deposit);
Deposit = connect(mapStateToPropsDeposit)(Deposit)


export default reduxForm({
  form: 'deposit',
  destroyOnUnmount: false,
  validate
})(Deposit)
