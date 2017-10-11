import React, { Component } from 'react';
import {
  TextField
} from 'redux-form-material-ui'
import { reduxForm, Field, reset} from 'redux-form'
import SearchIcon from 'material-ui/svg-icons/action/search';
import Clear from 'material-ui/svg-icons/content/clear';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import PropTypes from 'prop-types';
import _ from 'lodash'

import './index.css'
import { searchTomosByFields } from '../../redux/ducks/tomos'
import selectors from  '../../redux/selectors'

console.log(searchTomosByFields)

const style = {
  width: '256px',
  margin: '30px',
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
        searchTomosByFields(
            this.props.title,
            authors,
            atomicSpecies
        )
    );

    this.props.dispatch(push('/'));
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
      <form style={style} onKeyDown={this.onKeyDown}>
        <Field
          name="title"
          component={TextField}
          hintText="Title"
          floatingLabelText="Title"
        />
        <Field
          name="authors"
          component={TextField}
          hintText="Author"
          floatingLabelText="Author"
        />
        <Field
          name="atomicSpecies"
          component={TextField}
          hintText="Atomic Species"
          floatingLabelText="Atomic Species"/>
        <div>
          <RaisedButton
            label="Search"
            labelPosition="after"
            primary={true}
            icon={<SearchIcon />}
            style={style.button}
            onClick={() => this.search()}
          />
          <RaisedButton
            label="Clear"
            labelPosition="after"
            primary={true}
            icon={<Clear />}
            style={style.button}
            onClick={() => this.reset()}
          />
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

