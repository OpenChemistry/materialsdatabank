import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import ImageIcon from '@material-ui/icons/Image';
import PageHead from '../page-head';
import PageBody from '../page-body';
import { CardContent, CardActionArea } from '@material-ui/core';

import TomvizImg from './tomviz.png';
import ForwardImg from './forward.png';
import GenfireImg from './genfire.jpg';
import VestaImg from './vesta.png';
import TracingImg from './tracing.png';

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
            <ImageIcon/>
          </Typography>
        </div>
      </div>
    );
  }
}

class SoftwareComponent extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Software
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
          </Typography>
          <Typography color="inherit" gutterBottom variant="body2">
            Below is a non-comprehensive list of softwares and tools that can
            visualize the atomic structures downloaded from MDB, or perform reconstructions.
            Certain softwares (e.g. tomviz) can be used for both the visualization
            as well as the reconstruction process.
            The users are highly recommended to read the reference AET papers before
            proceeding to use the software.
            For more information please refer to the links below or to the tutorials section.
          </Typography>
          <Typography color="inherit" gutterBottom variant="body2">
            To get started, we suggest the following workflow: 
            <ol>
              <li>Download a 3D reconstruction (density map) from this website or anywhere else;</li>
              <li>Use the FORWARD PROJECTION software to generate a series of images;</li>
              <li>Use the series of images and corresponding angles as input for GENFIRE reconstruction;</li>
              <li>Use TRACING to trace atomic coordinates and classify the atomic species;</li>
              <li>Use TOMVIZ to visualize the 3D data.</li>
            </ol>
          </Typography>
          
        </PageHead>
        <PageBody>
          <Grid container style={{height: '100%'}} alignItems="stretch">
            <Grid item xs={12} md={4} className={classes.columns}>
              <Card>
                <CardActionArea className={classes.cardActionArea} href="https://tomviz.org" target="_blank">
                  <div className={classes.cardImage}>
                    {Image(TomvizImg)}
                  </div>
                  <CardContent>
                    <Typography>
                      Tomviz
                    </Typography>
                    <Typography color="textSecondary">
                      Visualization and reconstruction
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} className={classes.columns}>
              <Card>
                <div className={classes.cardImage}>
                  {Image(ForwardImg)}
                </div>
                <CardContent>
                  <Typography>
                    Forward Projection
                  </Typography>
                  <Typography color="textSecondary">
                    Projections from 3D reconstructions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} className={classes.columns}>
              <Card>
                <div className={classes.cardImage}>
                  {Image(GenfireImg)}
                </div>
                <CardContent>
                  <Typography>
                    GENFIRE
                  </Typography>
                  <Typography color="textSecondary">
                    Projections to 3D reconstructions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} className={classes.columns}>
              <Card>
                <CardActionArea className={classes.cardActionArea} href="http://www.jp-minerals.org/vesta/en/" target="_blank">
                  <div className={classes.cardImage}>
                    {Image(VestaImg)}
                  </div>
                  <CardContent>
                    <Typography>
                      VESTA
                    </Typography>
                    <Typography color="textSecondary">
                      Atomic models visualization
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} className={classes.columns}>
              <Card>
                <div className={classes.cardImage}>
                  {Image(TracingImg)}
                </div>
                <CardContent>
                  <Typography>
                    Atom Tracing
                  </Typography>
                  <Typography color="textSecondary">
                    Atomic coordinates from reconstruction
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </PageBody>
      </div>
    );
  }
}

SoftwareComponent = withStyles(style)(SoftwareComponent);

export default SoftwareComponent;
