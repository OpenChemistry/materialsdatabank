import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PageHead from '../page-head';
import PageBody from '../page-body';
import VideoItem from './videoItem';


const style = (theme) => (
  {
    columns: {
      padding: theme.spacing.unit * 3
    }
  }
);


class AetComponent extends Component {
  render() {
    const { classes } = this.props;
    const videos = [
      {
        title: 'Electron Tomography I',
        description: 'Dr. Yongsoo Yang',
        url: 'https://www.youtube.com/watch?v=2sk0xe8k_uI',
        img: 'https://i1.ytimg.com/vi/2sk0xe8k_uI/mqdefault.jpg'
      },
      {
        title: 'Electron Tomography II',
        description: 'Dr. Yongsoo Yang',
        url: 'https://www.youtube.com/watch?v=AtD2v3XVJjk',
        img: 'https://i1.ytimg.com/vi/AtD2v3XVJjk/mqdefault.jpg'
      },
      {
        title: 'FET Short Courses',
        description: '2017',
        url: 'https://sites.google.com/lbl.gov/fet2017-short-course/home'
      }
    ];
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            AET Courses
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
          </Typography>
          <Typography color="inherit" gutterBottom variant="body2">
            In recent years AET has gained traction in the scientific community.
            With the gained traction there is a need for tutorials and short courses.
            Below are links to a few of them either in video form or with slides available for download. 
          </Typography>
        </PageHead>
        <PageBody>
          <Grid container style={{height: '100%'}} alignItems="stretch">
            {
              videos.map((video,i) => (
                <Grid item key={i} xs={12} md={4} className={classes.columns}>
                  <VideoItem {...video}/>
                </Grid>
              ))
            }
          </Grid>
        </PageBody>
      </div>
    );
  }
}

AetComponent = withStyles(style)(AetComponent);

export default AetComponent;
