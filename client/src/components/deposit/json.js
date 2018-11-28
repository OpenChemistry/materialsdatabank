import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

export default class JsonPopulate extends Component {
  fileInput;

  onFileSelect = (e) => {
    if (e.target.files.length === 0) {
      return;
    }

    const { onJsonParsed } = this.props;
    if (!onJsonParsed) {
      return;
    }

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = JSON.parse(event.target.result);
      onJsonParsed(data);
    }
    reader.readAsText(file);
  }

  render() {
    return (
      <Button
        style={{float: 'right'}} size='small'
        onClick={() => {
          if (this.fileInput) {
            this.fileInput.click();
          }
        }}
      >
        Fill from file
        <input
          ref={ref => {this.fileInput = ref;}}
          type="file"
          accept='application/json'
          hidden
          onChange={this.onFileSelect}
        />
      </Button>
    );
  }
}
