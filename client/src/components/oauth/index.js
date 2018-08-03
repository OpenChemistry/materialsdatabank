import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import google from './google.svg';
import github from './github.svg';
import PropTypes from 'prop-types';
import _ from 'lodash';

import selectors from '../../redux/selectors';
import { selectAuthProvider, setAuthProvider } from '../../redux/ducks/app'
import { authenticate } from '../../redux/ducks/girder'

import './index.css'

class OauthRedirect extends Component {
  render = () => {
    const {providers, provider} = this.props;

    if (!_.isNil(providers) && !_.isNil(providers) && _.has(providers, provider)) {
      const url = providers[provider];
      window.location = url;
    }
    return (null);
  }
}

OauthRedirect.propTypes = {
    providers: PropTypes.object,
    provider: PropTypes.string
  }

OauthRedirect.defaultProps = {
  providers: {},
  provider: null
}

function redirectMapStateToProps(state, ownProps) {
  const providers = selectors.girder.getOauthProviders(state);
  const provider = selectors.app.getOauthProvider(state);

  return {
    providers,
    provider
  }
}
OauthRedirect = connect(redirectMapStateToProps)(OauthRedirect);

const contentStyle = {
  maxWidth: '300px'
}

class SelectLoginProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const {open} = nextProps;
    this.setState({
      open
    });
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
    this.props.dispatch(selectAuthProvider(false))
  };

  handleGoogle = () => {
    this.props.dispatch(selectAuthProvider(false))
    this.props.dispatch(authenticate(this.props.token))
    this.props.dispatch(setAuthProvider('Google'))
  }

  handleGitHub = () => {
    this.props.dispatch(selectAuthProvider(false))
    this.props.dispatch(authenticate(this.props.token))
    this.props.dispatch(setAuthProvider('GitHub'))
  }

  render = () => {

  const actions = [
    <Button
      key="cancel"
      color="primary"
      onClick={this.handleClose}
    >
      Cancel
    </Button>
  ]

    // title="Select a login provider. You'll be taken to the provider to authenticate.
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
      >
        <DialogTitle id="login-dialog-title">Login Provider</DialogTitle>
        <List>
          <ListItem key='google' button onClick={this.handleGoogle}>
            <ListItemText primary="Sign in with Google" />
            <ListItemIcon>
              <img className='mdb-google' src={google} alt="google" />
            </ListItemIcon>
          </ListItem>
          {/*
          <ListItem  key='github' button onClick={this.handleGitHub}>
            <ListItemText primary="Sign in with GitHub" />
            <ListItemIcon>
              <img className='mdb-github' src={github} alt="github" />
            </ListItemIcon>
          </ListItem>
          */}
        </List>
        <DialogActions>
          {actions}
        </DialogActions>
      </Dialog>
    );

  }
}

function selectLoginProviderMapStateToProps(state, ownProps) {
  const open = selectors.app.selectAuthProvider(state);

  return {
    open,
  }
}
SelectLoginProvider = connect(selectLoginProviderMapStateToProps)(SelectLoginProvider)

export {
  OauthRedirect,
  SelectLoginProvider
}

