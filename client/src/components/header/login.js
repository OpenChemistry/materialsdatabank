import React, { Component } from 'react';
import { connect } from 'react-redux'
import ActionInput from 'material-ui/svg-icons/action/input';
import FlatButton from 'material-ui/FlatButton';

import { selectAuthProvider }  from '../../redux/ducks/app'

class Login extends Component {
  render = () => {
    return (
        <FlatButton icon={<ActionInput/>}
                    onTouchTap={this.handleTouchTap}
                    label='Log in'
                    labelPosition='before' />
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


