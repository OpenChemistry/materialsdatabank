import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import React, { Component } from 'react';

import './index.css'
import uclaLogo from './ucla.png';
import kitwareLogo from './Kitware_Full_Logo.png';
import strobeLogo from './strobe.png';
import berkeleyLogo from './berkeley.jpg';


const style = {
  height: '2.5rem'
}

export default class Footer extends Component {
  render = () => {
    return (
      <BottomNavigation style={style}>
        <BottomNavigationAction
          icon={<img className='bottom-logo' src={uclaLogo} alt="UCLA" />}
          onClick={() => this.select(0)} href="http://www.ucla.edu/"
          target="_blank"
        />
        <BottomNavigationAction
          icon={<img className='bottom-logo' src={kitwareLogo} alt="Kitware" />}
          onClick={() => this.select(0)} href="http://www.kitware.com"
          target="_blank"
        />
        <BottomNavigationAction
          icon={<img className='bottom-logo' src={strobeLogo} alt="STROBE" />}
          onClick={() => this.select(0)} href="http://strobe.colorado.edu/"
          target="_blank"
        />
        <BottomNavigationAction
          icon={<img className='bottom-logo' src={berkeleyLogo} alt="Berkeley Lab" />}
          onClick={() => this.select(0)} href="http://www.lbl.gov/"
          target="_blank"
        />
      </BottomNavigation>
    );
  }
}
