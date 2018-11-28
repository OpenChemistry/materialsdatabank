import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import React, { Component } from 'react';

import './index.css'
import uclaLogo from './ucla.png';
import kitwareLogo from './Kitware_Full_Logo.png';
import strobeLogo from './strobe.png';
import berkeleyLogo from './berkeley.jpg';
import { Typography } from '@material-ui/core';


const style = {
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  bottomNavigation: {
    flexGrow: 1,
    height: '3rem',
    backgroundColor: 'transparent'
  },
  license: {
    textAlign: 'center',
    paddingRight: '1rem'
  }
}

export default class Footer extends Component {
  render = () => {
    return (
      <div style={style.root}>
        <BottomNavigation style={style.bottomNavigation}>
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
        <div style={style.license}>
          <Typography variant='caption'>
            All data is released under <a href='https://creativecommons.org/licenses/by/4.0/' target='_blank'>CC BY 4</a>
          </Typography>
        </div>
      </div>
    );
  }
}
