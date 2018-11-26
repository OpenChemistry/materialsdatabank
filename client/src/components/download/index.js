import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import PageHead from '../page-head';
import PageBody from '../page-body';

const style = (theme) => (
  {
  }
);

class DownloadComponent extends Component {
  render() {
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Download
          </Typography>
          <Typography color="inherit" gutterBottom variant="body2">
            
          </Typography>
          <Typography color="inherit" gutterBottom variant="body2">
            
          </Typography>
        </PageHead>
        <PageBody>
        </PageBody>
      </div>
    );
  }
}

DownloadComponent = withStyles(style)(DownloadComponent);

export default DownloadComponent;
