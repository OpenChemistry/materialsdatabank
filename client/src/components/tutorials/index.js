import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router'
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import PageHead from '../page-head';
import PageBody from '../page-body';
import { Paper, List, ListItem, Divider } from '@material-ui/core';


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

class TutorialsComponent extends Component {
  navigate = (route) => {
    if (route) {
      this.props.dispatch(push(route));
    }
  }
  render() {
    const tutorials = [
      {
        'title': 'AET videos for a general audience',
        'url': '/tutorials/aet-general'
      },
      {
        'title': 'AET video tutorials and slides',
        'url': '/tutorials/aet'
      },
      {
        'title': 'The MDB validation process',
        'url': '/tutorials/validation'
      },
      {
        'title': 'Visualizing structures',
        'url': '/tutorials/visualizing'
      },
      {
        'title': 'References',
        'url': '/tutorials/references'
      }
    ];
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
              {
                tutorials.map((tutorial, i) => (
                  <div>
                    <ListItem disabled={!tutorial.url} button onClick={() => {this.navigate(tutorial.url)}}>
                      {tutorial.title}
                    </ListItem>
                    {i < tutorials.length - 1 &&
                    <Divider></Divider>
                    }
                  </div>
                ))
              }
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
