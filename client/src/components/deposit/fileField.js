import React, { Component } from 'react';

import {isNil} from 'lodash-es';

import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';

import { getUploadByFile } from  '../../redux/selectors/upload'

import filesize from 'filesize';
import uuid4 from 'uuid/v4';

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
  fraction = 0;
  id;

  constructor(props) {
    super(props);
    // random id associated to the file field,
    // useful to store progress in the redux store
    this.id = uuid4();
  }

  render = () => {
    const { total, progress, classes, input, label, disabled, meta } = this.props;

    if (!isNil(progress) && !isNil(total)) {
      this.fraction = progress / total;
    }

    const file = input.value;
    const name = file !== '' ? file.name : '';
    const size = file !== '' ? filesize(file.size) : '';
    const showProgress = this.fraction > 0;

    return (
      <div
        className={classes.field}
      >
        <div
          className={classes.textField}
        >
          <TextField
            fullWidth
            disabled={true}
            value={file !== '' ?`${name} (${size})` : ''}
            label={label}
            error={!!meta.error}
            helperText={meta.error ? meta.error : ''}
            onClick={() => {
              if (this.fileInput) {
                this.fileInput.click();
              }
            }}
          />

          <LinearProgress
            hidden={!showProgress}
            variant="determinate"
            value={100 * this.fraction}
          />
        </div>

        <Button
          disabled={disabled}
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
            onChange={(e) => {
              let file = e.target.files[0];
              file.fieldId = this.id;
              return input.onChange(file);
            }}
          />
        </Button>
      </div>
    );
  }
}

function mapStateToPropsFileInputField(state, ownProps) {

  const upload = getUploadByFile(state, ownProps.input.value);
  let props = {};
  if (!isNil(upload)) {
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

export default FileInputField;
