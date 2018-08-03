import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';

const style = theme => (
  {
    body: {
      width: '100%',
      backgroundColor: 'transparent',
      marginTop: theme.spacing.unit * theme.pageBody.marginTop
    },
    content: {
      position: 'relative',
      width: '100%',
      maxWidth: theme.spacing.unit * theme.pageContent.width,
      left: '50%',
      transform: 'translateX(-50%)'
    }
  }
)

class PageBody extends Component {
  
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.body}>
        <div className={classes.content}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withStyles(style)(PageBody);

