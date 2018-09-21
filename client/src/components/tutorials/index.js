import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router'
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import ImageIcon from '@material-ui/icons/Image';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import PageHead from '../page-head';
import PageBody from '../page-body';
import { CardHeader, CardMedia, CardContent, Paper, List, ListItem, Divider } from '@material-ui/core';


const style = (theme) => (
  {
    columns: {
      padding: theme.spacing.unit * 3
    },
    cardImage: {
      width: '100%',
      height: 30 * theme.spacing.unit,
      backgroundColor: theme.palette.grey[300]
    }
  }
);

const Image = (src) => {
  if (src) {
    return (
      <img style={{objectFit: 'cover', width: '100%', height: '100%'}} src={src} />
    );
  } else {
    return (
      <div style={{width: '100%', height: '100%'}}>
        <div style={{top: '50%', position: 'relative', transform: 'translateY(-50%)'}}>
          <Typography align="center" variant="headline" color="textSecondary">
            <ImageIcon/>
          </Typography>
        </div>
      </div>
    );
  }
}

class TutorialsComponent extends Component {
  navigate = (route) => {
    if (route) {
      this.props.dispatch(push(route));
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Tutorials
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
          </Typography>
          <Typography color="inherit" gutterBottom variant="body2">
            We are excited for your interest in MDB and AET.
            We understand that getting started can be a challenge, so we hope these resources will help.
            Although performing the experiments and analysis is the best way to learn AET, going through and reading these resources is probably the next best thing.
          </Typography>
          <Typography color="inherit" gutterBottom variant="body2">
            This section is aimed at those seeking for directions on how to use MDB and AET.
            These links below are step-by-step guides to complete a wide range of tasks on MDB, from creating a user account to depositing and downloading the data.
            A link explaining our validation process is also provided.
          </Typography>
        </PageHead>
        <PageBody>
          <Paper>
            <List>
              <ListItem disabled button onClick={() => {this.navigate(null)}}>
                Creating a new account
              </ListItem>
              <Divider></Divider>
              <ListItem disabled button onClick={() => {this.navigate(null)}}>
                Depositing a structure
              </ListItem>
              <Divider></Divider>
              <ListItem button onClick={() => {this.navigate('/tutorials/aet')}}>
                AET video tutorials and slides
              </ListItem>
              <Divider></Divider>
              <ListItem button onClick={() => {this.navigate('/tutorials/validation')}}>
                The MDB validation process
              </ListItem>
              <Divider></Divider>
              <ListItem disabled button onClick={() => {this.navigate(null)}}>
                Visualizing structures
              </ListItem>
              <Divider></Divider>
              <ListItem disabled button onClick={() => {this.navigate(null)}}>
                References
              </ListItem>
            </List>
          </Paper>
        </PageBody>
      </div>
    );
  }
}

TutorialsComponent = connect()(TutorialsComponent);
TutorialsComponent = withStyles(style)(TutorialsComponent);

export default TutorialsComponent;