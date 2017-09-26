import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';

import './index.css'


const style = {
  height: 250,
  width: 300,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

export default class TomoExperiment extends Component {
  render = () => {
    return (
      <Paper style={style} zDepth={1} >
       {this.props.name}
      </Paper>
    );
  }
}

TomoExperiment.propTypes = {
  _id: PropTypes.string,
  name: PropTypes.string,
}

TomoExperiment.defaultProps = {
}
