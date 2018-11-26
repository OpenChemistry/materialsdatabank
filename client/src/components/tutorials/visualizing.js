import React from 'react';
import Typography from '@material-ui/core/Typography';
import PageHead from '../page-head';
import PageBody from '../page-body';

const VisualizingComponent = () => {
  return (
    <div>
      <PageHead>
        <Typography  color="inherit" gutterBottom variant="display1">
          Visualizing structures
        </Typography>
        <Typography variant="subheading" paragraph color="inherit">
        </Typography>
        <Typography color="inherit" gutterBottom variant="body2">
          All MDB structures can be viewed easily in the browser on each individual structure page.
          An enhanced view with export capabilities can also be utilized by clicking the enhanced view.
          This adds functions to choose between multiple background colors, sliders to crop the data in [X,Y,Z], and to easily export a high-resolution image file as a .png.
          The elemental colors are predetermined to be colors in line with the JMOL colormap.
          If you would like to download and view the data on your own, the data can be downloaded as a XYZ, CJSON, or CML file formats.
          These can then be viewed easily in third-party applications.
          An example of viewing a structure in TOMVIZ is shown below. 
        </Typography>
      </PageHead>
      <PageBody>
      </PageBody>
    </div>
  )
};

export default VisualizingComponent;