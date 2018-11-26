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


class AetGeneralComponent extends Component {
  render() {
    const { classes } = this.props;
    const videos = [
      {
        title: 'See individual atoms in 3D',
        description: '',
        url: 'https://www.youtube.com/watch?v=yqLlgIaz1L0',
        img: 'https://i1.ytimg.com/vi/yqLlgIaz1L0/mqdefault.jpg'
      },
      {
        title: 'Address Feynman’s 1959’s challenge',
        description: '',
        url: 'https://www.youtube.com/watch?v=o9D9iEogFHI',
        img: 'https://i1.ytimg.com/vi/o9D9iEogFHI/mqdefault.jpg'
      }
    ];
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            AET videos for a general audience
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

AetGeneralComponent = withStyles(style)(AetGeneralComponent);

export default AetGeneralComponent;
