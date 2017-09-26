import React, { Component } from 'react';

import './index.css'
import SearchResults from '../searchresults'

export default class Main extends Component {
  render = () => {
    return (
      <div>
        <SearchResults/>
      </div>
    );
  }
}
