import React, { Component } from 'react';
import { connect } from 'react-redux'

import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';

import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';

import { push } from 'connected-react-router'

import './index.css'

const style = {
  menu: {
    color: 'white'
  }
}

class SideBar extends Component {

  pushRoute = (route) => this.props.dispatch(push(route));

  render = () => {
    return (
      <MenuList>
        <MenuItem
          style={style.menu}
          onClick={() => this.pushRoute('/welcome') }
        >
          <HomeIcon color="primary" />&nbsp;
          <Typography color="inherit" variant="subheading">Welcome</Typography>
        </MenuItem>
        <MenuItem
          style={style.menu}
          onClick={() => this.pushRoute('/deposit') }
        >
          <OpenInBrowserIcon color="primary" />&nbsp;
          <Typography color="inherit" variant="subheading">Deposit</Typography>
        </MenuItem>
        <MenuItem
          style={style.menu}
          onClick={() => this.pushRoute('/search') }
        >
          <SearchIcon color="primary" />&nbsp;
          <Typography color="inherit" variant="subheading">Search</Typography>
        </MenuItem>
      </MenuList>
    );
  }
}

SideBar = connect()(SideBar);
export default SideBar;
