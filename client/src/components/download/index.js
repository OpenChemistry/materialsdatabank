import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import PageHead from '../page-head';
import PageBody from '../page-body';
import { CardContent, CardActionArea } from '@material-ui/core';


const style = (theme) => (
  {
    columns: {
      padding: theme.spacing.unit * 3
    },
    cardImage: {
      width: '100%',
      height: 24 * theme.spacing.unit,
      backgroundColor: theme.palette.grey[300]
    },
    cardActionArea: {
      width: '100%'
    }
  }
);


class DownloadComponent extends Component {
  render() {
    const { classes } = this.props;
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
