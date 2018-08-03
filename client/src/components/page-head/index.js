import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';

const style = theme => (
  {
    header: {
      width: '100%',
      backgroundColor: theme.palette.primary.main,
      paddingBottom: theme.spacing.unit * theme.pageHead.paddingBottom,
      paddingTop: theme.spacing.unit * theme.pageHead.paddingTop
    },
    content: {
      position: 'relative',
      width: '100%',
      maxWidth: theme.spacing.unit * theme.pageContent.width,
      left: '50%',
      transform: 'translateX(-50%)',
      color: theme.palette.primary.contrastText
    }
  }
)

class PageHead extends Component {
  
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.header}>
        <div className={classes.content}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withStyles(style)(PageHead);


