import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';

import ChromeReaderIcon from '@material-ui/icons/ChromeReaderMode'
import ContactsIcon from '@material-ui/icons/ImportContacts';
import GroupIcon from '@material-ui/icons/GroupWork';

import { has } from 'lodash-es';

import { TwitterTimelineEmbed } from 'react-twitter-embed';

import { wc } from '../../utils/webcomponent';

import PageHead from '../page-head';
import PageBody from '../page-body';

import './index.css'
import { CardActions } from '@material-ui/core';

const style = theme => (
  {
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      paddingBottom: '0.75rem'
    },
    body: {
      flexGrow: 1,
      marginTop: 0
    },
    evenColumns: {
      backgroundColor: 'none',
      padding: theme.spacing.unit * 3
    },
    oddColumns: {
      backgroundColor: grey[200],
      padding: theme.spacing.unit * 3
    },
    molecule: {
      width: '100%',
      height: theme.spacing.unit * 40,
      position: 'relative'
    },
    columnTitle: {
      marginBottom: theme.spacing.unit * 3
    }
  }
)

let EmbeddedVideo = () => {
  return (
    <Card>
      <div className="intrinsic-container intrinsic-container-4x3">
        <iframe src="https://player.vimeo.com/video/202250016" frameBorder="0" allowFullScreen></iframe>
      </div>
    </Card>
  );
}

class Welcome extends Component {

  constructor(props) {
    super(props);

    this.state = {
      molecule0: {
        cjson: null,
        slug: null,
        rotate: true,
      },
      molecule1: {
        cjson: null,
        slug: null,
        rotate: true
      },
      posts: null
    }
  }

  fetchMolecule(slug, key) {
    fetch(`/api/v1/mdb/datasets/${slug}/structures`)
    .then((res) => {
      return res.json();
    })
    .then((structures) => {
      if (Array.isArray(structures) && structures.length > 0 && has(structures[0], 'cjson')) {
        this.setState({...this.state, [key]: { ...this.state[key], cjson: structures[0].cjson, slug: slug}});
      }
    })
    .catch((e) => {console.log(e)});
  }

  // Fake fetch of a molecule of the week
  componentDidMount() {
    this.fetchMolecule('FePt00001', 'molecule0');
    this.fetchMolecule('WXXX00001', 'molecule1');
  }

  onMoleculeInteract(key) {
    if (this.state[key].rotate) {
      this.setState({...this.state, [key]: { ...this.state[key], rotate: false}});
    }
  }
  
  render = () => {
    const { classes } = this.props;
    const { molecule0, molecule1 } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <PageHead noOverlap>
            <Grid container spacing={24} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography color="inherit" gutterBottom variant="display1">
                  Materials Data Bank
                </Typography>
                <Typography color="inherit" gutterBottom variant="body2">
                  The Materials Data Bank (MDB) archives the 3D coordinates and chemical species of individual atoms in materials without assuming
                  crystallinity determined by atomic electron tomography (AET). The databank is designed to provide useful resources for research
                  and education in studying the 3D atomic arrangements and associated material properties arising from non-crystalline structures,
                  such as point defects, dislocations, grain boundaries, stacking faults and disorders. The MDB aims to serve the broad physical
                  science community and also bridge the gap between the experimental measurements and computational methods such as density
                  functional theory and molecular dynamics.
                </Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <div>
                  <EmbeddedVideo/>
                </div>
              </Grid>
            </Grid>
          </PageHead>
        </div>
        <div className={classes.body}>
          <PageBody noOverlap>
          <Grid container style={{height: '100%'}} alignItems="stretch">
            <Grid item xs={12} md={4} className={classes.evenColumns}>
              <div className={classes.columnTitle}>
                <Typography gutterBottom variant="title" color="textSecondary">
                  <ContactsIcon />&nbsp;Recent Publications
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4} className={classes.oddColumns}>
              <div className={classes.columnTitle}>
                <Typography gutterBottom variant="title" color="textSecondary">
                  <ChromeReaderIcon />&nbsp;Feed/News
                </Typography>
              </div>
              <Paper>
                <TwitterTimelineEmbed
                  sourceType="profile"
                  screenName="materdatabank"
                  options={{height: 800}}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} className={classes.evenColumns}>
              <div className={classes.columnTitle}>
                <Typography variant="title" color="textSecondary">
                  <GroupIcon />&nbsp;Structure Spotlight
                </Typography>
              </div>
                <Card
                  style={{marginBottom: '2rem'}}
                  onMouseDown={(e) => {this.onMoleculeInteract('molecule0')}}
                >
                  <div className={classes.molecule}>
                    <oc-molecule-moljs
                      ref={wc(
                        {},
                        {
                          cjson: molecule0.cjson,
                          rotate: molecule0.rotate,
                          options: {
                            style: {
                              sphere: {
                                scale: 0.5
                              }
                            }
                          }
                        }
                      )}
                    />
                  </div>
                  {molecule0.slug &&
                  <CardActions>
                    <Button
                      color="primary"
                      onClick={() => {this.props.dispatch(push(`/dataset/${molecule0.slug}`))}}
                    >
                      View Dataset
                    </Button>
                  </CardActions>
                  }
                </Card>
                <Card
                  onMouseDown={(e) => {this.onMoleculeInteract('molecule1')}}
                >
                  <div className={classes.molecule}>
                    <oc-molecule-moljs
                      ref={wc(
                        {},
                        {
                          cjson: molecule1.cjson,
                          rotate: molecule1.rotate,
                          options: {
                            style: {
                              sphere: {
                                scale: 0.5
                              }
                            }
                          }
                        }
                      )}
                    />
                  </div>
                  {molecule1.slug &&
                  <CardActions>
                    <Button
                      color="primary"
                      onClick={() => {this.props.dispatch(push(`/dataset/${molecule1.slug}`))}}
                    >
                      View Dataset
                    </Button>
                  </CardActions>
                  }
                </Card>
            </Grid>
          </Grid>
          </PageBody>
        </div>
      </div>
    );
  }
}

Welcome = connect()(Welcome);
export default withStyles(style)(Welcome);

