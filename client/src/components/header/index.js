import AppBar from 'material-ui/AppBar';
import React, { Component } from 'react';

import './index.css'
import logo from './OpenChemistry_Logo.svg';


const style = {
    backgroundColor: '#FAFAFA'
}

const titleStyle = {
  margin: 0,
  paddingTop: '8px',
  paddingLeft: '10px',

  lineHeight: 'normal',
  color: '#424242',
}

export default class Header extends Component {
  render = () => {
  return (
    <AppBar
      title={
        <div>
          <div style={{ fontSize: 32, marginTop: 10 }}>Material Data Bank</div>
          <div style={{ fontSize: 14, fontWeight: 300 }}>An Information Portal for 3D atomic electron tomography data</div>
        </div>
      }
      titleStyle={titleStyle}
      style={style}
      iconElementLeft={<img className='mdb-logo' src={logo} alt="logo" />} />
  );
  }
}
