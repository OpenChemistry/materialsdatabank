import React, { Component } from 'react';
import { connect } from 'react-redux'

import './index.css'
import SearchResults from '../searchresults'

class Main extends Component {

  render = () => {
    return (
      <div>
        <SearchResults/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Main)

