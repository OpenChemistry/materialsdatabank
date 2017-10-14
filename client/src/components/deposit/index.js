import React, { Component } from 'react';
import { TextField } from 'redux-form-material-ui'
import { reduxForm, Field, reset} from 'redux-form'
import SearchIcon from 'material-ui/svg-icons/action/search';
import Clear from 'material-ui/svg-icons/content/clear';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import PropTypes from 'prop-types';
import _ from 'lodash'
import prettyBytes from 'pretty-bytes';
import LinearProgress from 'material-ui/LinearProgress';

import { upload } from '../../redux/ducks/upload'
import selectors from  '../../redux/selectors'
import { clearNewDataSet } from '../../redux/ducks/upload';
import './index.css'

const style = {
  width: '90%',
  margin: '30px',
  button: {
    float: 'right',
    margin: '20px 10px auto auto'
  },
  field: {
    width: '100%',
    'max-width': '700px'

  }
}

class FileInputField extends Component {

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
        'max-width': '700px',
        'min-width': '445px'
      },
      button: {
        'margin-top': '38px',
        float: 'right'
      },
      textField: {
        cursor: 'auto',
        width: '100%'
      },
      fileDiv: {
        width: '70%',
        float: 'left'
      }
    }
    const file = this.props.input.value;
    const name = file !== '' ? file.name : '';
    const size = file !== '' ? prettyBytes(file.size) : '';
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
              hintText="Disabled Hint Text"
              value={file !== '' ?`${name} (${size})` : ''}
              floatingLabelText={this.props.label}
              underlineShow={false}
            />
            <LinearProgress
              style={progressStyle}
              mode="determinate"
              value={this.state.complete ? 0 : this.props.progress}
              min={0}
              max={this.state.complete ? 0 : this.props.total}
            />
          </div>
          <RaisedButton
              style={style.button}
              containerElement='label' // <-- Just add me!
              label='Select file'>
                <input
                  type="file"
                  style={{display: 'none'}}
                  onChange={(e) => this.props.input.onChange(e.target.files[0])}
                />
          </RaisedButton>
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

  return new Promise((resolve, reject) => {
    dispatch(upload(title, authors, url, slug, structureFile,
        reconstructionFile, imageFile, resolve, reject));
  });
//    this.props.dispatch(push('/'));
}

const validate = values => {
  const errors = {}
  const requiredFields = [ 'title', 'authors', 'structureFile']
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
    console.log('deposit')
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
            hintText="Title"
            floatingLabelText="Title"
          />
          <Field
            style={style.field}
            name="authors"
            component={TextField}
            hintText="Authors"
            floatingLabelText='Authors ( "and" separated )'
          />
          <Field
            style={style.field}
            name="slug"
            component={TextField}
            hintText="URL slug"
            floatingLabelText="URL slug ( human readable identifier )"
            errorText={this.props.slugError}
          />
          <Field
            style={style.field}
            name="url"
            component={TextField}
            hintText="URL to paper"
            floatingLabelText="URL to paper"
          />
          <Field
            style={style.field}
            name="imageFile"
            component={FileInputField}
            label='Image file ( Thumbnail for dataset )'
          />
          <Field
            style={style.field}
            name="structureFile"
            component={FileInputField}
            label={'Structure file ( XYZ )'}
            hintText={'Structure file'}
          />
          <Field
            style={style.field}
            name="reconstructionFile"
            component={FileInputField}
            label={'Reconstruction file ( EMD or TIFF )'}
            hintText={'Reconstruction file'}
          />
          <LinearProgress
            style={indeterminateProgress}
            mode="indeterminate"
          />
          <div style={style.field}>
            <RaisedButton
              disabled={pristine || submitting || invalid}
              type='submit'
              label='Deposit'
              labelPosition="after"
              primary={true}
              icon={<SearchIcon />}
              style={style.button}
            />
            <RaisedButton
              disabled={pristine || submitting}
              label="Clear"
              labelPosition="after"
              primary={true}
              icon={<Clear />}
              style={style.button}
              onClick={() => this.reset()}
            />
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

