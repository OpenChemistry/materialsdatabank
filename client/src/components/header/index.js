import AppBar from 'material-ui/AppBar';
import React, { Component } from 'react';

import './index.css'
import logo from './OpenChemistry_Logo.svg';


const style = {
    backgroundColor: '#FAFAFA',
}

export default class Header extends Component {
  render = () => {
  return (
    <AppBar style={style} iconElementLeft={<img className='mdb-logo' src={logo} alt="logo" />} />
  );
  }
}
