import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import Image from 'material-ui/svg-icons/image/image';
import {grey300, blueGrey50} from 'material-ui/styles/colors';

import './index.css'
import { symbols } from '../../elements'

const publicStyle = {
  height: '90%',
  width: '90%',
  margin: 20,
  textAlign: 'center',
  //display: 'inline-block',
};

const privateStyle = {
    ...publicStyle,
    backgroundColor: blueGrey50
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

const imageStyle = {
  height: '100%'
}

class SearchResult extends Component {

  onTouchTap = () => {

    let id = this.props._id;
    if (!_.isNil(this.props.slug)) {
      id = this.props.slug;
    }

    this.props.dispatch(push(`/dataset/${id}`))
  }

  render = () => {
    let imageUrl = null;
    if (!_.isNil(this.props.imageFileId)) {
      imageUrl = `${window.location.origin}/api/v1/mdb/datasets/${this.props._id}/image`;
    }
    const species = this.props.atomicSpecies.map((an) => symbols[an]).join(', ');
    const speciesText = `Atomic Species: ${species}`;
    return (
      <Card style={this.props.public ? publicStyle : privateStyle} zDepth={2} onTouchTap={this.onTouchTap}>
        <CardHeader
          style={cardHeaderStyle}
          textStyle={textStyle}
          title={this.props.title}
          subtitle={speciesText}
        />
        <CardMedia style={cardMediaStyle}>
          { !_.isNil(imageUrl) &&
          <img src={imageUrl} alt="" />
          }
          {
            _.isNil(imageUrl) &&
          <Image style={imageStyle} color={grey300}/>
          }
        </CardMedia>
        { !this.props.public &&
        <div className={'mdb-search-text'}>This dataset is awaiting approval.</div>
        }
      </Card>
    );
  }
}

SearchResult.propTypes = {
  _id: PropTypes.string,
  slug: PropTypes.string,
  title: PropTypes.string,
  authors: PropTypes.array,
  imageFileId:  PropTypes.string,
  public: PropTypes.bool,
  atomicSpecies: PropTypes.array
}

SearchResult.defaultProps = {
  public: false,
  slug: null,
  atomicSpecies: []
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(SearchResult)
