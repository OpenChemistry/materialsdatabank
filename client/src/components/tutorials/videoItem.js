import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import VideoIcon from '@material-ui/icons/Videocam';
import { CardContent, CardActionArea } from '@material-ui/core';

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

let VideoItem = (props) => {
  const {classes, title, description, url, img} = props;
  return (
    <CardActionArea className={classes.cardActionArea} href={url} target="_blank">
      <Card>
        <div className={classes.cardImage}>
          {Image(img)}
        </div>
        <CardContent>
          <Typography noWrap>
            {title}
          </Typography>
          <Typography color="textSecondary" noWrap>
            {description}
          </Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  );
}

VideoItem = withStyles(style)(VideoItem);

export default VideoItem;