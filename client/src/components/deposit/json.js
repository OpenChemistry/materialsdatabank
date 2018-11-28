import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

import filesize from 'filesize';

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

class JsonPopulate extends Component {
  fileInput;
  file;

  constructor(props) {
    super(props);
    this.state = {
      file: null
    }
  }

  onFileSelect = (e) => {
    if (e.target.files.length === 0) {
      return;
    }

    const { onJsonParsed } = this.props;
    if (!onJsonParsed) {
      return;
    }


    const file = e.target.files[0];
    this.setState({file});

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = JSON.parse(event.target.result);
      onJsonParsed(data);
    }
    reader.readAsText(file);
  }

  render() {
    const { classes } = this.props;
    const { file } = this.state;

    const name = file ? file.name : '';
    const size = file ? filesize(file.size) : '';

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
            value={file ? `${name} (${size})` : ''}
            label={'Projection and Reconstruction Metadata'}
            onClick={() => {
              if (this.fileInput) {
                this.fileInput.click();
              }
            }}
          />
        </div>

        <Button
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
            accept='application/json'
            onChange={this.onFileSelect}
          />
        </Button>
      </div>
    );
  }
}

JsonPopulate = withStyles(style)(JsonPopulate);

export default JsonPopulate;
