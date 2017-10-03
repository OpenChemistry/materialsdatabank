import React, { Component } from 'react';
import { connect } from 'react-redux'
import SearchBar from 'material-ui-search-bar'
import _ from 'lodash'

import './index.css'
import SearchResults from '../searchresults'
import { searchTomos } from '../../redux/ducks/tomos'

class Main extends Component {

  constructor(props)
  {
    super(props)
    this.state = {
      searchText: null
    }
  }

  componentWillMount = () => {
    this.props.dispatch(searchTomos());
  }

  onChange = (searchText) => {
    this.setState({
      searchText
    })
  }

  onRequestSearch = () => {

    if (_.isString(this.state.searchText) && !_.isEmpty(this.state.searchText)) {
      const text = this.state.searchText.toLowerCase();
      this.props.dispatch(searchTomos(text.split(/\s/)))
    }
    else {
      this.props.dispatch(searchTomos());
    }
  }



  render = () => {

    const searchBarStyle = {
      margin: '20px auto',
      maxWidth: 800
    };

    return (
      <div>
        <SearchBar
          hintText={'Search by author, paper, microscope, atomic species'}
          onChange={this.onChange}
          onRequestSearch={this.onRequestSearch}
          style={searchBarStyle}
        />
        <SearchResults/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Main)

