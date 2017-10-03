import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import React, { Component } from 'react';

import './index.css'
import logo from './Kitware_Full_Logo.png';


const style = {
  position: 'fixed',
  bottom: '10px'
}

export default class Footer extends Component {
  render = () => {
    return (
        <BottomNavigation style={style}>
          <BottomNavigationItem
            icon={<img className='mdb-kitware-logo' src={logo} alt="logo" />}
            onClick={() => this.select(0)} href="http://www.kitware.com"
          />
      </BottomNavigation>
    );
  }
}
