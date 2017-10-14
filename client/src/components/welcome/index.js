import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

import './index.css'

const style = {
    paper: {
      display: 'flex',
      float: 'right',
      margin: '20px 32px 16px 0',
      height: '80%'
    }
};

export default class Welcome extends Component {

  render = () => {
    return (
      <Paper style={style.paper}>
        <div style={{margin: '20px'}} className={'mdb-welcome-text'}>
          <p>
            Materials Data Bank (MDB) archives the information about the 3D atomic structures (3D atomic coordinates and chemical species)
            determined by atomic electron tomography (AET).
          </p>

          <p>
            This databank is designed to provide useful resources for research and education in studying the true 3D atomic structure and
            associated materials properties arising from non-crystalline structures such as defects, dislocations, strain, complex grain structure,
            local chemical ordering, and phase boundaries.
          </p>
        </div>
      </Paper>
    );
  }
}



