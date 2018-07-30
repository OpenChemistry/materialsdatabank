import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import React, { Component } from 'react';

import './index.css'
import kitwareLogo from './Kitware_Full_Logo.png';
import strobeLogo from './strobe.png';
import uclaLogo from './ucla.png';
import berkeleyLogo from './berkeley.jpg';


const style = {
  position: 'fixed',
  bottom: '20px'
}

export default class Footer extends Component {
  render = () => {
    return (
        <BottomNavigation style={style}>
          <BottomNavigationItem
            icon={<img className='mdb-kitware-logo' src={kitwareLogo} alt="Kitware" />}
            onClick={() => this.select(0)} href="http://www.kitware.com"
          />
          <BottomNavigationItem
            icon={<img className='mdb-kitware-logo' src={strobeLogo} alt="STROBE" />}
              onClick={() => this.select(0)} href="http://strobe.colorado.edu/"
          />
          <BottomNavigationItem
            icon={<img style={{width: '75px'}} src={berkeleyLogo} alt="Berkeley Lab" />}
            onClick={() => this.select(0)} href="http://www.lbl.gov/"
          />
      </BottomNavigation>
    );
  }
}
