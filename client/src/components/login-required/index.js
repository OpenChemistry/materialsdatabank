import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import PageHead from '../page-head';
import PageBody from '../page-body';
import Login from '../header/login';

const style = (theme) => (
  {
  }
)

class LoginRequired extends Component {

  render = () => {
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Login Required
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
            Login is needed to access this resource <Login />
          </Typography>
        </PageHead>
        <PageBody>
        </PageBody>
      </div>
    );
  }
}
LoginRequired = withStyles(style)(LoginRequired);
export default LoginRequired;
