import AppBar from 'material-ui/AppBar';
import React, { Component } from 'react';
import SearchBar from 'material-ui-search-bar'
import { connect } from 'react-redux'
import _ from 'lodash'
import { push } from 'react-router-redux'

import './index.css'
import logo from './OpenChemistry_Logo.svg';
import { searchTomosByText } from '../../redux/ducks/tomos'


const style = {
    backgroundColor: '#FAFAFA'
}

const titleStyle = {
  margin: 0,
  paddingTop: '8px',
  paddingLeft: '10px',

  lineHeight: 'normal',
  color: '#424242',
}

const searchBarStyle = {
  margin: '15px 50px',
  maxWidth: 800
};

const iconStyleRight = {
  width: '50%'
}

class RightElement extends Component {

  constructor(props)
  {
    super(props)
    this.state = {
      searchText: null
    }
  }

  componentWillMount = () => {
    this.props.dispatch(searchTomosByText());
  }

  onChange = (searchText) => {
    this.setState({
      searchText
    })
  }

  onRequestSearch = () => {
    this.props.dispatch(push('/'))
    if (_.isString(this.state.searchText) && !_.isEmpty(this.state.searchText)) {
      const text = this.state.searchText.toLowerCase();
      this.props.dispatch(searchTomosByText(text.split(/\s/)))
    }
    else {
      this.props.dispatch(searchTomosByText());
    }
  }

  render = () => {
    return (
      <SearchBar
        hintText={'Search by author, paper, microscope, atomic species'}
        onChange={this.onChange}
        onRequestSearch={this.onRequestSearch}
        style={searchBarStyle}
        className={'mdb-searchbar'}
      />);
  }
}

function mapStateToProps(state) {
  return {};
}

RightElement = connect(mapStateToProps)(RightElement)

export default class Header extends Component {
  render = () => {
  return (
    <AppBar
      title={
        <div>
          <div style={{ fontSize: 32, marginTop: 10 }}>Material Data Bank</div>
          <div style={{ fontSize: 14, fontWeight: 300 }}>An Information Portal for 3D atomic electron tomography data</div>
        </div>
      }
      titleStyle={titleStyle}
      style={style}
      iconElementLeft={<img className='mdb-logo' src={logo} alt="logo" />}
      iconElementRight={<RightElement/>}
      iconStyleRight={iconStyleRight} />
  );
  }
}
