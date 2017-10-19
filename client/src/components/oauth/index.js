import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactRedirect from 'react-redirect'
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
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
      return (
           <ReactRedirect location={url}/>
      );
    } else {
      return (null);
    }
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
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.handleClose}
    />]

    // title="Select a login provider. You'll be taken to the provider to authenticate.
    return (
      <Dialog
       contentStyle={contentStyle}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
      >
      <FlatButton icon={<img className='mdb-google' src={google} alt="google" />}
        onTouchTap={this.handleGoogle}
        label='Sign in with Google'
        labelPosition='after' />
      {/*<FlatButton icon={<img className='mdb-github' src={github} alt="github" />}
        onTouchTap={this.handleGitHub}
        label='Sign in with GitHub'
         labelPosition='after' />*/}
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

