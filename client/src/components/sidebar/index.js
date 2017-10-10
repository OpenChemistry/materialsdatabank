import React, { Component } from 'react';
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Home from 'material-ui/svg-icons/action/home';
import OpenInBrowser from 'material-ui/svg-icons/action/open-in-browser';
import Search from 'material-ui/svg-icons/action/search';
import { push } from 'react-router-redux'

import './index.css'

const style = {
    paper: {
      display: 'inline-block',
      float: 'left',
      margin: '20px 32px 16px 0',
      backgroundColor: '#FAFAFA',
      height: '90%'
    }
};

class SideBar extends Component {

  pushRoute = (route) => this.props.dispatch(push(route));

  render = () => {
    return (
        <Paper style={style.paper}>
          <Menu>
            <MenuItem
              primaryText="Welcome"
              leftIcon={<Home />}
              onClick={() => this.pushRoute('/welcome') }
            />
            <MenuItem
              primaryText="Deposit"
              leftIcon={<OpenInBrowser />}
              onClick={() => this.pushRoute('/deposit') }
            />
            <MenuItem
              primaryText="Search"
              leftIcon={<Search />}
              onClick={() => this.pushRoute('/search') }
            />
          </Menu>
        </Paper>);
  }
}

SideBar = connect()(SideBar);
export default SideBar;
