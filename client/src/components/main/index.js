import React, { Component } from 'react';
import SearchBar from 'material-ui-search-bar'

import './index.css'
import SearchResults from '../searchresults'

export default class Main extends Component {
  render = () => {

    const searchBarStyle = {
      margin: '20px auto',
      maxWidth: 800
    };

    return (
      <div>
        <SearchBar
          hintText={'Search by author, paper, microscope, atomic species'}
          onChange={() => console.log('onChange')}
          onRequestSearch={() => console.log('onRequestSearch')}
          style={searchBarStyle}
        />
        <SearchResults/>
      </div>
    );
  }
}
