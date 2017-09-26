import React, { Component } from 'react';
import {GridList, GridTile} from 'material-ui/GridList';

import TomoRecord from '../tomo'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
//    width: 500,
//    height: 450,
    overflowY: 'auto',
  },
};

const data = [
  { _id: 1,
    name: 'Tomo1',
    author: 'jill111',
  },
  {
    _id: 2,
    name: 'Tomo2',
    author: 'pashminu',
  },
  {
    _id: 3,
    name: 'Tomo3',
    author: 'Danson67',
  },
  {
    _id: 4,
    name: 'Tomo4',
    author: 'fancycrave1',
  },
  {
    _id: 5,
    name: 'Tomo5',
    author: 'Hans',
  },
  {
    _id: 6,
    name: 'Tomo6',
    author: 'fancycravel',
  },
  {
    _id: 7,
    name: 'Tomo7',
    author: 'jill111',
  },
  {
    _id: 8,
    name: 'Tomo8',
    author: 'BkrmadtyaKarki',
  },
];


export default class SearchResults extends Component {
  render = () => {
    return (
      <div style={styles.root}>
        <GridList
          cellHeight={'auto'}
          style={styles.gridList}
          cols={4}
        >
          {data.map((tomo) => (
            <GridTile
              key={tomo._id}
            >
              <TomoRecord name={tomo.name}/>
            </GridTile>
          ))}
        </GridList>
      </div>
    );
  }
}
