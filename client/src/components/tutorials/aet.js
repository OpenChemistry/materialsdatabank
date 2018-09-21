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


class AetComponent extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            AET Courses
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
          </Typography>
          <Typography color="inherit" gutterBottom variant="body2">
            In recent years atomic electron tomography has gained traction in the scientific community.
            And with the gained traction a need for tutorials and short courses.
            Below are links to a few of them either in video form or with slides available for download. 
          </Typography>
        </PageHead>
        <PageBody>
          <Grid container style={{height: '100%'}} alignItems="stretch">
            <Grid item xs={12} md={4} className={classes.columns}>
              <CardActionArea className={classes.cardActionArea} href="https://www.youtube.com/watch?v=2sk0xe8k_uI" target="_blank">
                <Card>
                  <div className={classes.cardImage}>
                    {Image('https://i1.ytimg.com/vi/2sk0xe8k_uI/mqdefault.jpg')}
                  </div>
                  <CardContent>
                    <Typography>
                      Electron Tomography I
                    </Typography>
                    <Typography color="textSecondary">
                      Prof. Yongsoo Yang
                    </Typography>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
            <Grid item xs={12} md={4} className={classes.columns}>
              <Card>
                <CardActionArea className={classes.cardActionArea} href="https://www.youtube.com/watch?v=AtD2v3XVJjk" target="_blank">
                  <div className={classes.cardImage}>
                    {Image('https://i1.ytimg.com/vi/AtD2v3XVJjk/mqdefault.jpg')}
                  </div>
                  <CardContent>
                    <Typography>
                      Electron Tomography II
                    </Typography>
                    <Typography color="textSecondary">
                      Prof. Yongsoo Yang
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} className={classes.columns}>
              <Card>
                <div className={classes.cardImage}>
                  {Image()}
                </div>
                <CardContent>
                  <Typography>
                    FET Short Courses
                  </Typography>
                  <Typography color="textSecondary">
                    2017
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

AetComponent = withStyles(style)(AetComponent);

export default AetComponent;
