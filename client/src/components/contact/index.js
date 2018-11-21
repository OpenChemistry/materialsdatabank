import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import ImageIcon from '@material-ui/icons/Image';
import PageHead from '../page-head';
import PageBody from '../page-body';
import { CardMedia, CardContent, CardActionArea } from '@material-ui/core';

import MiaoImg from './miao.jpg';
import HanwellImg from './hanwell.jpg';
import ErciusImg from './ercius.jpg';
import OphusImg from './ophus.jpg';
import KimImg from './kim.jpg';

const style = (theme) => (
  {
    columns: {
      padding: theme.spacing.unit * 3
    },
    cardImage: {
      width: '100%',
      height: 30 * theme.spacing.unit,
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
      <img style={{objectFit: 'contain', width: '100%', height: '100%'}} src={src} />
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

class ContactComponent extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Contact us
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
          </Typography>
          <Typography color="inherit" gutterBottom variant="body2">
            To understand material properties and functionality at the fundamental level,
            one must know the 3D positions of atoms with high precision. The MDB team has
            committed to make the MDB of experimentally determined 3D atomic structures
            freely accessible to the broad physical science community.
          </Typography>
          <Typography color="inherit" gutterBottom variant="body2">
            The team is comprised of professors, scientists, and software engineers
            stationed at the University of California, Los Angeles (UCLA), Lawrence
            Berkeley National Laboratory, Kitware, and the NSF STC STROBE.
          </Typography>
        </PageHead>
        <PageBody>
          <Grid container style={{height: '100%'}} alignItems="stretch">
            <Grid item xs={12} md={4} lg={3} className={classes.columns}>
              <Card>
                <CardActionArea className={classes.cardActionArea} href="http://www.pa.ucla.edu/directory/jianwei-john-miao" target="_blank">
                  <CardMedia className={classes.cardImage}>
                    {Image(MiaoImg)}
                  </CardMedia>
                  <CardContent>
                    <Typography>
                      Prof. Jianwei (John) Miao
                    </Typography>
                    <Typography>
                      <i>Founder</i>
                    </Typography>
                    <Typography color="textSecondary">
                      UCLA
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} lg={3} className={classes.columns}>
              <Card>
                <CardActionArea className={classes.cardActionArea} href="https://www.kitware.com/marcus-hanwell/" target="_blank">
                  <CardMedia className={classes.cardImage}>
                    {Image(HanwellImg)}
                  </CardMedia>
                  <CardContent>
                    <Typography>
                      Dr. Marcus D. Hanwell
                    </Typography>
                    <Typography>
                      <i>Data & Software Architect</i>
                    </Typography>
                    <Typography color="textSecondary">
                      Kitware, Inc.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} lg={3} className={classes.columns}>
              <Card>
                <CardActionArea className={classes.cardActionArea} href="https://foundry.lbl.gov/people/peter_ercius.html" target="_blank">
                  <CardMedia className={classes.cardImage}>
                    {Image(ErciusImg)}
                  </CardMedia>
                  <CardContent>
                    <Typography>
                      Dr. Peter Ercius
                    </Typography>
                    <Typography>
                      <i>Staff Researcher</i>
                    </Typography>
                    <Typography color="textSecondary">
                      LBNL
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} lg={3} className={classes.columns}>
              <Card>
                <CardActionArea className={classes.cardActionArea} href="https://foundry.lbl.gov/people/colin_ophus.html" target="_blank">
                  <CardMedia className={classes.cardImage}>
                    {Image(OphusImg)}
                  </CardMedia>
                  <CardContent>
                    <Typography>
                      Dr. Colin Ophus
                    </Typography>
                    <Typography>
                      <i>Research Scientist</i>
                    </Typography>
                    <Typography color="textSecondary">
                      LBNL
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} lg={3} className={classes.columns}>
              <Card>
                <CardActionArea className={classes.cardActionArea} href="http://www.physics.ucla.edu/research/imaging/people.html" target="_blank">
                  <CardMedia className={classes.cardImage}>
                    {Image(KimImg)}
                  </CardMedia>
                  <CardContent>
                    <Typography>
                      Dr. Dennis S. Kim
                    </Typography>
                    <Typography>
                      <i>Postdoctoral Researcher</i>
                    </Typography>
                    <Typography color="textSecondary">
                      UCLA
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </PageBody>
      </div>
    );
  }
}

ContactComponent = withStyles(style)(ContactComponent);

export default ContactComponent;
