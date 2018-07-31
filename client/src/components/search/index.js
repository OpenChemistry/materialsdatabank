import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

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

const style = {
  button: {
    float: 'right',
    margin: '20px 10px auto auto'
  }

}

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
            atomicSpecies
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
    return (
      <form onKeyDown={this.onKeyDown}>
        <Field
          fullWidth
          name="title"
          component={TextField}
          label="Title"
        />
        <Field
          fullWidth
          name="authors"
          component={TextField}
          label="Author"
        />
        <Field
          fullWidth
          name="atomicSpecies"
          component={TextField}
          label="Atomic Species"
        />
        <div>
          <Button
            variant="raised"
            color="primary"
            style={style.button}
            onClick={() => this.search()}
          >
            <SearchIcon />
            Search
          </Button>
          <Button
            variant="raised"
            color="primary"
            style={style.button}
            onClick={() => this.reset()}
          >
            <ClearIcon/>
            Clear
          </Button>
        </div>
      </form>
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

Search = connect(mapStateToProps)(Search)


export default reduxForm({
  form: 'search',
  destroyOnUnmount: false
})(Search)

