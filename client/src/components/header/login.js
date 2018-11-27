import React, { Component } from 'react';
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button';

import InputIcon from '@material-ui/icons/Input';

import { selectAuthProvider }  from '../../redux/ducks/app'

class Login extends Component {
  render = () => {
    return (
        <Button onClick={this.handleTouchTap}>
          <InputIcon/>&nbsp;
          Log in / Register
        </Button>
    );
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.props.dispatch(selectAuthProvider(true))
  };
}

function mapStateToProps(state, ownProps) {
  return {}
}

export default connect(mapStateToProps)(Login)


