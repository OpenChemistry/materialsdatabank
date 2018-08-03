import React, { Component } from 'react';
import PropTypes from 'prop-types';


import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';

import grey from '@material-ui/core/colors/grey';

import ImageIcon from '@material-ui/icons/Image';

import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import _ from 'lodash'

import './index.css'
import { symbols } from '../../elements'

const cardStyle = {
  marginLeft: '1rem',
  marginRight: '1rem',
  cursor: 'pointer',
  height: '90%'
}

const cardMediaStyle = {
  width: '100%',
  height: '10rem',
  backgroundColor: grey[300]
}

let Image = (src) => {
  if (src) {
    return (
      <img style={{objectFit: 'cover', width: '100%', height: '100%'}} src={src} />
    );
  } else {
    return (
      <div style={{width: '100%', height: '100%'}}>
        <div style={{top: '50%', position: 'relative', transform: 'translateY(-50%)'}}>
          <Typography align="center" variant="headline" color="textSecondary">
            <ImageIcon/>
          </Typography>
        </div>
      </div>
    );
  }
}

class SearchResult extends Component {

  onClickHandler = () => {

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
      <Card onClick={this.onClickHandler} style={cardStyle}>
        <CardContent>
          <Typography gutterBottom variant="body1" color="textSecondary"  noWrap>
            {speciesText}
          </Typography>
        </CardContent>
        <div style={cardMediaStyle}>
          {Image(imageUrl)}
        </div>
        <CardContent>
          <Typography gutterBottom variant="body2">
            {this.props.title}
          </Typography>
          { !this.props.public &&
            <Typography variant="caption">
              * This dataset is awaiting approval
            </Typography>
          }
        </CardContent>
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
