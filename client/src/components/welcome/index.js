import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';

import PageHead from '../page-head';
import PageBody from '../page-body';

import './index.css'

const style = theme => (
  {
    header: {
      backgroundColor: theme.palette.secondary.main,
    },
    body: {
      marginTop: - theme.spacing.unit * 20
    },
    content: {
      width: '100%',
      maxWidth: theme.spacing.unit * 40
    }
  }
)

let embeddedVideo = () => {
  return (
    <div className="intrinsic-container intrinsic-container-4x3">
      <iframe src="https://player.vimeo.com/video/202250016" frameBorder="0" allowFullScreen></iframe>
    </div>
  );
}

class Welcome extends Component {
  
  render = () => {
    const { classes } = this.props;
    return (
      <div>
        <PageHead>
          <Typography color="inherit" gutterBottom variant="display1">
            Materials Data Bank
          </Typography>
          <Typography variant="title" paragraph color="inherit">
            An Information Portal for 3D atomic electron tomography data
          </Typography>
          <Typography color="inherit" gutterBottom variant="body2">
            Materials Data Bank (MDB) archives the information about the 3D atomic structures (3D atomic coordinates and chemical species)
            determined by atomic electron tomography (AET).
          </Typography>
          <Typography color="inherit" gutterBottom variant="body2">
            This databank is designed to provide useful resources for research and education in studying the true 3D atomic structure and
            associated materials properties arising from non-crystalline structures such as defects, dislocations, strain, complex grain structure,
            local chemical ordering, and phase boundaries.
          </Typography>
        </PageHead>
        <PageBody>
          <Card>
            <CardMedia
              component={embeddedVideo}
            />
          </Card>
        </PageBody>
      </div>
    );
  }
}

export default withStyles(style)(Welcome);

