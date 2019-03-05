import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { TextField } from 'redux-form-material-ui';

import { reduxForm, Field, reset} from 'redux-form';

import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import PropTypes from 'prop-types';
import _ from 'lodash'

import './index.css'
import { searchDatasetsByFields } from '../../redux/ducks/datasets'
import selectors from  '../../redux/selectors'

import PageHead from '../page-head';
import PageBody from '../page-body';

const style = (theme) => (
  {
    field: {
      width: '100%',
      display: 'flex',
      marginBottom: 2 * theme.spacing.unit,
    },
    textField: {
      flexGrow: 1
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }
)

class Search extends Component {

  search = () => {

    let authors = null;
    let atomicSpecies = null;

    if (_.isString(this.props.authors)) {
      authors = this.props.authors.split(/\s/);
    }
    if (_.isString(this.props.atomicSpecies)) {
      atomicSpecies = this.props.atomicSpecies.split(/\s/);
    }

    this.props.dispatch(
        searchDatasetsByFields(
            this.props.title,
            authors,
            atomicSpecies,
            this.props.mdbId
        )
    );

    this.props.dispatch(push('/results'));
  }

  reset = () => {
    this.props.dispatch(reset('search'));
  }

  onKeyDown = e => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      this.search();
    }
  }

  render = () => {
    const { pristine, submitting, invalid, classes } = this.props;
    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            Search for structures
          </Typography>
        </PageHead>
        <PageBody>
          <Card>
            <form onKeyDown={this.onKeyDown}>
              <CardContent>
                <Field
                  fullWidth
                  name="mdbId"
                  className={classes.field}
                  component={TextField}
                  label="MDB ID (FePt00001)"
                />
                <Field
                  fullWidth
                  name="title"
                  className={classes.field}
                  component={TextField}
                  label="Name of the structure (e.g. chemical order)"
                />
                <Field
                  fullWidth
                  name="authors"
                  className={classes.field}
                  component={TextField}
                  label="Author (e.g. John Doe and Jane Doe)"
                />
                <Field
                  fullWidth
                  name="atomicSpecies"
                  className={classes.field}
                  component={TextField}
                  label="Atomic species (e.g. Fe Pt)"
                />

              </CardContent>
              <CardActions className={classes.actions}>
                <Button
                  variant="raised"
                  disabled={ submitting || invalid}
                  color="primary"
                  onClick={() => this.search()}
                >
                  <SearchIcon />
                  Search
                </Button>
                <Button
                  variant="raised"
                  disabled={pristine || submitting}
                  color="primary"
                  onClick={() => this.reset()}
                >
                  <ClearIcon/>
                  Clear
                </Button>
              </CardActions>
            </form>
          </Card>
        </PageBody>
      </div>
    );
  }
}

Search.propTypes = {
  title: PropTypes.string,
  authors: PropTypes.string,
  atomicSpecies:  PropTypes.string
}

Search.defaultProps = {
  title: null,
  authors: null,
  atomicSpecies: null
}

function mapStateToProps(state, ownProps) {

  let search = selectors.search.getSearch(state);
  let props = {}
  if (!_.isNil(search)) {
    props = {...search.values}
  }

  return props;
}

Search = withStyles(style)(Search);
Search = connect(mapStateToProps)(Search)


export default reduxForm({
  form: 'search',
  destroyOnUnmount: false
})(Search)

