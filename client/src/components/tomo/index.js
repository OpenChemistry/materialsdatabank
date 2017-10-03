import React, { Component } from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import PropTypes from 'prop-types';

import SearchResult from '../searchresult'
import selectors from '../../redux/selectors';
import { symbols } from '../../elements'

const style = {
  //height: '100%',
  width: '90%',
  margin: 20,
  textAlign: 'center',
  //display: 'inline-block',
};

const cardHeaderStyle = {
  textAlign: 'left',
  'text-overflow': 'ellipsis'
}

export default class Tomo extends Component {
  render = () => {
    const species = this.props.atomicSpecies.map((an) => symbols[an]).join(', ');
    const authors = this.props.authors.join(' and ');
    const speciesText = `Atomic Species: ${species}`;
    return (
        <Card style={style} zDepth={2} >
          <CardHeader
            style={cardHeaderStyle}
            title={this.props.paper}
            subtitle={authors}
          />
          <CardMedia>

          </CardMedia>
        </Card>

    );
  }
}

Tomo.propTypes = {
  _id: PropTypes.string,
  paper: PropTypes.string,
  authors: PropTypes.array,
  imageFileId:  PropTypes.string,
}

Tomo.defaultProps = {
  paper: '',
  authors: [],
  imageFileId:  null,
  atomicSpecies: []
}

