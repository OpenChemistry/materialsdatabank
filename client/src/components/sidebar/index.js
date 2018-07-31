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

class SideBar extends Component {

  pushRoute = (route) => this.props.dispatch(push(route));

  render = () => {
    return (
      <MenuList>
        <MenuItem
          onClick={() => this.pushRoute('/welcome') }
        >
          <HomeIcon />
          <Typography>Welcome</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => this.pushRoute('/deposit') }
        >
          <OpenInBrowserIcon/>
          <Typography>Deposit</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => this.pushRoute('/search') }
        >
          <SearchIcon/>
          <Typography>Search</Typography>
        </MenuItem>
      </MenuList>
    );
  }
}

SideBar = connect()(SideBar);
export default SideBar;
