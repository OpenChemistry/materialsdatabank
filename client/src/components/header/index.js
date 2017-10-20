import AppBar from 'material-ui/AppBar';
import React, { Component } from 'react';
import SearchBar from 'material-ui-search-bar'
import { connect } from 'react-redux'
import _ from 'lodash'
import { push } from 'react-router-redux'
import LinearProgress from 'material-ui/LinearProgress';

import './index.css'
import logo from './OpenChemistry_Logo.svg';
import { searchDatasetsByText } from '../../redux/ducks/datasets'
import Menu from './menu'
import Login from './login'
import selectors from '../../redux/selectors';


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
  maxWidth: 800,
  width: '70%'
};

const iconStyleRight = {
  width: '50%'
}

const divStyle = {
  width: '100%',
  display: 'flex',
}

const loginMenuStyle = {
  'margin-top': '18px'
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
    this.props.dispatch(searchDatasetsByText());
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
      this.props.dispatch(searchDatasetsByText(text.split(/\s/)))
    }
    else {
      this.props.dispatch(searchDatasetsByText());
    }
  }

  render = () => {
    return (
      <div style={divStyle}>
        <SearchBar
          hintText={'Search by author, paper, microscope, atomic species'}
          onChange={this.onChange}
          onRequestSearch={this.onRequestSearch}
          style={searchBarStyle}
          className={'mdb-searchbar'}
        />
        <div style={loginMenuStyle}>
          {!this.props.isAuthenticated ? <Login/> : <Menu/>}
        </div>
      </div>);
  }
}

function mapStateToProps(state) {
  const isAuthenticated = selectors.girder.isAuthenticated(state);

  return {
    isAuthenticated,
  }
}

RightElement = connect(mapStateToProps)(RightElement)

class Header extends Component {
  render = () => {
  const progressStyle = {}

  if (!this.props.progress) {
    progressStyle['display'] = 'none';
  }
  return (
    <div>
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
      <LinearProgress
        style={progressStyle}
        mode="indeterminate"
      />
     </div>
  );
  }
}


function mapStateToPropsHeader(state) {

  const progress = selectors.app.progress(state);

  return {
    progress,
  }
}

export default connect(mapStateToPropsHeader)(Header)
