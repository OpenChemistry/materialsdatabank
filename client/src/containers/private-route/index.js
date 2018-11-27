import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { getMe } from '../../redux/selectors/girder';
import LoginRequired from '../../components/login-required';

class PrivateRoute extends Component {
  render() {
    const {component, me, ...rest} = this.props;
    const RenderComponent = component;
    if (me) {
      return (
        <Route
          {...rest}
          render={(props) => {
            return <RenderComponent {...props}/>;
          }}
        />
      );
    } else {
      return (
        <LoginRequired/>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    me: getMe(state)
  }
}

export default connect(mapStateToProps)(PrivateRoute);
