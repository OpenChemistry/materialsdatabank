import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';

import './index.css'

let embeddedVideo = () => {
  return (
    <div className="intrinsic-container intrinsic-container-4x3">
      <iframe src="https://player.vimeo.com/video/202250016" frameBorder="0" allowFullScreen></iframe>
    </div>
  );
}

export default class Welcome extends Component {

  render = () => {
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            Materials Data Bank
          </Typography>
          <Typography gutterBottom variant="subheading" color="textSecondary">
          An Information Portal for 3D atomic electron tomography data
          </Typography>
          <Typography gutterBottom variant="body2">
            Materials Data Bank (MDB) archives the information about the 3D atomic structures (3D atomic coordinates and chemical species)
            determined by atomic electron tomography (AET).
          </Typography>
          <Typography gutterBottom variant="body2">
            This databank is designed to provide useful resources for research and education in studying the true 3D atomic structure and
            associated materials properties arising from non-crystalline structures such as defects, dislocations, strain, complex grain structure,
            local chemical ordering, and phase boundaries.
          </Typography>
        </CardContent>
        <CardMedia
          component={embeddedVideo}
        />
      </Card>
    );
  }
}



