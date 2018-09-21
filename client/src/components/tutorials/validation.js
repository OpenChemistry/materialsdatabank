import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import VideoIcon from '@material-ui/icons/Videocam';
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


const Image = (src) => {
  if (src) {
    return (
      <img style={{objectFit: 'cover', width: '100%', height: '100%'}} src={src} />
    );
  } else {
    return (
      <div style={{width: '100%', height: '100%'}}>
        <div style={{top: '50%', position: 'relative', transform: 'translateY(-50%)'}}>
          <Typography align="center" variant="headline" color="textSecondary">
            <VideoIcon/>
          </Typography>
        </div>
      </div>
    );
  }
}


class ValidationComponent extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Validation Process
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
          </Typography>
          <Typography color="inherit" gutterBottom variant="body2">
            A database is only as useful as the data that is in it.
            We believe that a rigorous form of validation is a vital part of the Materials Data Bank and have developed easy to use validation scripts using the freely available Python programming language.
          </Typography>
        </PageHead>
        <PageBody>
        </PageBody>
      </div>
    );
  }
}

ValidationComponent = withStyles(style)(ValidationComponent);

export default ValidationComponent;
