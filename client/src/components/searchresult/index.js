import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import './index.css'
import { symbols } from '../../elements'

const style = {
  height: '90%',
  width: '90%',
  margin: 20,
  textAlign: 'center',
  //display: 'inline-block',
};

const cardHeaderStyle = {
  textAlign: 'left'
}

const textStyle = {
  paddingRight: '0px'
}

const cardMediaStyle = {
  width: '40%',
  margin: 20,
  display: 'inline-block'
};

class SearchResult extends Component {

  onTouchTap = () => {
    this.props.dispatch(push(`/tomo/${this.props._id}`))
  }

  render = () => {
    const imageUrl = `${window.location.origin}/api/v1/file/${this.props.imageFileId}/download`;
    const species = this.props.atomicSpecies.map((an) => symbols[an]).join(', ');
    const speciesText = `Atomic Species: ${species}`;
    return (
      <Card style={style} zDepth={2} onTouchTap={this.onTouchTap}>
        <CardHeader
          style={cardHeaderStyle}
          textStyle={textStyle}
          title={this.props.title}
          subtitle={speciesText}
        />
        <CardMedia style={cardMediaStyle}>
          <img src={imageUrl} alt="" />
        </CardMedia>
      </Card>
    );
  }
}

SearchResult.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string,
  authors: PropTypes.array,
  imageFileId:  PropTypes.string,
}

SearchResult.defaultProps = {
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(SearchResult)
