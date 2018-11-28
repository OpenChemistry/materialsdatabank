import React, { Component } from 'react';
import { connect } from 'react-redux'

import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';

import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import SoftwareIcon from '@material-ui/icons/DesktopMac';
import TutorialIcon from '@material-ui/icons/Forum';
import AboutIcon from '@material-ui/icons/PermIdentity';
import InboxIcon from '@material-ui/icons/Inbox';

import selectors from '../../redux/selectors';

import { push } from 'connected-react-router'

import './index.css'

const style = {
  menu: {
    color: 'white',
    paddingTop: '1rem',
    paddingBottom: '1rem',
  }
}

class SideBar extends Component {

  pushRoute = (route) => this.props.dispatch(push(route));

  render = () => {
    const { me } = this.props;

    return (
      <MenuList>
        <MenuItem
          style={style.menu}
          onClick={() => this.pushRoute('/welcome') }
        >
          <HomeIcon color="primary" />&nbsp;
          <Typography color="inherit" variant="subheading">Welcome</Typography>
        </MenuItem>
        { me &&
        <MenuItem
          style={style.menu}
          onClick={() => this.pushRoute('/my-datasets')}
        >
          <InboxIcon color="primary" />&nbsp;
          <Typography color="inherit" variant="subheading">My Datasets</Typography>
        </MenuItem>
        }
        { me &&
        <MenuItem
          style={style.menu}
          onClick={() => this.pushRoute('/deposit')}
        >
          <OpenInBrowserIcon color="primary" />&nbsp;
          <Typography color="inherit" variant="subheading">Deposit</Typography>
        </MenuItem>
        }
        <MenuItem
          style={style.menu}
          onClick={() => this.pushRoute('/search') }
        >
          <SearchIcon color="primary" />&nbsp;
          <Typography color="inherit" variant="subheading">Search</Typography>
        </MenuItem>
        <MenuItem
          style={style.menu}
          onClick={() => this.pushRoute('/software') }
        >
          <SoftwareIcon color="primary" />&nbsp;
          <Typography color="inherit" variant="subheading">Software</Typography>
        </MenuItem>
        <MenuItem
          style={style.menu}
          onClick={() => this.pushRoute('/tutorials') }
        >
          <TutorialIcon color="primary" />&nbsp;
          <Typography color="inherit" variant="subheading">Tutorials</Typography>
        </MenuItem>
        <MenuItem
          style={style.menu}
          onClick={() => this.pushRoute('/contact') }
        >
          <AboutIcon color="primary" />&nbsp;
          <Typography color="inherit" variant="subheading">Contact Us</Typography>
        </MenuItem>
      </MenuList>
    );
  }
}

function mapStateToPros(state, ownProps) {
  const me = selectors.girder.getMe(state);
  return {
    me
  }
}

SideBar = connect(mapStateToPros)(SideBar);
export default SideBar;
