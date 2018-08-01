import React, { Component } from 'react';
import { TextField } from 'redux-form-material-ui'
import { reduxForm, Field, reset} from 'redux-form'

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

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

import './index.css'

const style = {
  width: '90%',
  margin: '30px',
  button: {
    float: 'right',
    marginLeft: '0.5rem'
  },
  field: {
    width: '100%',
    marginTop: '1rem'
  }
}

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
    const style = {
      div: {
        width: '100%',
        marginTop: '1rem',
        display: 'flex'
      },
      button: {
        marginTop: '1rem',
        marginLeft: '1rem'
      },
      textField: {
        cursor: 'auto',
        width: '100%'
      },
      fileDiv: {
        flexGrow: '1'
      }
    }
    const file = this.props.input.value;
    const name = file !== '' ? file.name : '';
    const size = file !== '' ? filesize(file.size) : '';
    const showProgress = this.props.progress > 0;
    const progressStyle = {}
    if (!showProgress) {
      progressStyle['display'] = 'none';
    }
    return (

        <div style={style.div}>
          <div style={style.fileDiv}>
            <TextField style={style.textField}
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
              style={progressStyle}
              variant="determinate"
              value={this.state.complete ? 0 : (this.props.progress / this.props.total)*100}
            />
          </div>
          <Button
            disabled={this.props.disabled}
            style={style.button}
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
FileInputField = connect(mapStateToPropsFileInputField)(FileInputField)


const deposit = (values, dispatch) => {

  const {
    title,
    authors,
    slug,
    url,
    structureFile,
    reconstructionFile,
    imageFile} = values;

  if (!_.isNil(structureFile)) {
    structureFile.id = 'structureFile';
  }
  if (!_.isNil(reconstructionFile)) {
    reconstructionFile.id = 'reconstructionFile';
  }
  if (!_.isNil(imageFile)) {
    imageFile.id = 'imageFile';
  }

  dispatch(setProgress(true));

  return new Promise((resolve, reject) => {
    dispatch(upload(title, authors, url, slug, structureFile,
        reconstructionFile, imageFile, resolve, reject));
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
    const {handleSubmit, pristine, submitting, invalid} = this.props;
    const indeterminateProgress = {
      width: '90%',
      'top': '10px'

    }
    if (!submitting) {
      indeterminateProgress['display'] = 'none';
    }

    return (
       <div>
        <p className={'mdb-deposit-text'}>
          We currently only accept the atomic structural information published in peer-reviewed journal.
        </p>

        { !this.props.isLoggedIn &&
        <p className={'mdb-deposit-text'}>
          To deposit the atomic structure of materials, please login.
        </p>
        }
        {this.props.isLoggedIn &&
        <form style={style} onSubmit={handleSubmit(deposit)}>
          <Field
            style={style.field}
            name="title"
            component={TextField}
            label="Title"
          />
          <Field
            style={style.field}
            name="authors"
            component={TextField}
            label='Authors ( "and" separated )'
          />
          <Field
            style={style.field}
            name="slug"
            component={TextField}
            label="URL slug ( human readable identifier )"
            error={!!this.props.slugError}
            helperText={this.props.slugError}
          />
          <Field
            style={style.field}
            name="url"
            component={TextField}
            label="DOI"
          />
          <Field
            style={style.field}
            name="imageFile"
            component={FileInputField}
            label='Image file ( Thumbnail for dataset )'
            disabled={submitting}
          />
          <Field
            style={style.field}
            name="structureFile"
            component={FileInputField}
            label={'Structure file ( XYZ )'}
            hintText={'Structure file'}
            disabled={submitting}
          />
          <Field
            style={style.field}
            name="reconstructionFile"
            component={FileInputField}
            label={'Reconstruction file ( EMD or TIFF )'}
            hintText={'Reconstruction file'}
            disabled={submitting}
          />
          <div style={style.field}>
            <Button
              style={style.button}
                variant="raised"
                disabled={pristine || submitting || invalid}
                type='submit'
                color='primary'
              >
                <SearchIcon/>
                Deposit
              </Button>
              <Button
              style={style.button}
                variant="raised"
                disabled={pristine || submitting}
                color='primary'
                onClick={() => this.reset()}
              >
                <ClearIcon/>
                Clear
              </Button>
          </div>
        </form>
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
Deposit = connect(mapStateToPropsDeposit)(Deposit)


export default reduxForm({
  form: 'deposit',
  destroyOnUnmount: false,
  validate
})(Deposit)

