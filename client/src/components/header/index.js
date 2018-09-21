import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import MenuIcon from '@material-ui/icons/Menu';

import SearchBar from 'material-ui-search-bar'

import { connect } from 'react-redux'
import _ from 'lodash'
import { push } from 'connected-react-router'

import './index.css'
import logo from './mdb_logo.svg';
import { searchDatasetsByText } from '../../redux/ducks/datasets'
import Menu from './menu'
import Login from './login'
import selectors from '../../redux/selectors';

const searchBarStyle = {
  width: '100%',
  maxWidth: '30rem'
};

const iconStyleRight = {
  width: '50%'
}

const divStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end'
}

const loginMenuStyle = {
  alignSelf: 'center',
  marginLeft: '1rem'
  // marginTop: '18px'
}


class RightElement extends Component {

  constructor(props)
  {
    super(props)
    this.state = {
      searchText: null
    }
  }

  componentWillMount = () => {
    this.props.dispatch(searchDatasetsByText());
  }

  onChange = (searchText) => {
    this.setState({
      searchText
    })
  }

  onRequestSearch = () => {
    this.props.dispatch(push('/results'))
    if (_.isString(this.state.searchText) && !_.isEmpty(this.state.searchText)) {
      const text = this.state.searchText.toLowerCase();
      this.props.dispatch(searchDatasetsByText(text.split(/\s/)))
    }
    else {
      this.props.dispatch(searchDatasetsByText());
    }
  }

  render = () => {
    return (
      <div style={divStyle}>
        <Hidden mdDown>
          <SearchBar
            placeholder={'Search by author, paper, microscope, atomic species'}
            onChange={this.onChange}
            onRequestSearch={this.onRequestSearch}
            style={searchBarStyle}
            className={'mdb-searchbar'}
          />
        </Hidden>
        <div style={loginMenuStyle}>
          {!this.props.isAuthenticated ? <Login/> : <Menu/>}
        </div>
      </div>);
  }
}

function mapStateToProps(state) {
  const isAuthenticated = selectors.girder.isAuthenticated(state);

  return {
    isAuthenticated,
  }
}

RightElement = connect(mapStateToProps)(RightElement)

const appBarStyles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class Header extends Component {
  render = () => {
  const progressStyle = {}

  if (!this.props.progress) {
    progressStyle['display'] = 'none';
  }
  const {classes, onToggleMenu} = this.props;
  return (
    <div>
      <AppBar color="default" position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={onToggleMenu}
            className={classes.navIconHide}
          >
            <MenuIcon />
          </IconButton>
          <Button color="inherit" aria-label="Logo" style={{marginRight: 9, paddingTop: 5, paddingBottom: 5}}>
            <img className='mdb-logo' src={logo} alt="logo" />
          </Button>
          <Hidden smDown>
            <Typography variant="title" color="inherit" style={{flexGrow: 0}}>
              Materials Data Bank
              <Typography variant="caption" color="textSecondary">
                An Information Portal for 3D atomic electron tomography data
              </Typography>
            </Typography>
          </Hidden>
          <div style={{flexGrow: 1}}>
            <RightElement/>
          </div>
        </Toolbar>
      </AppBar>
      <LinearProgress
        style={progressStyle}
        variant="indeterminate"
      />
     </div>
  );
  }
}

function mapStateToPropsHeader(state) {

  const progress = selectors.app.progress(state);

  return {
    progress,
  }
}

Header = withStyles(appBarStyles)(Header);

export default connect(mapStateToPropsHeader)(Header)
