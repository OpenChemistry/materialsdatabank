import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';

import ImageIcon from '@material-ui/icons/Image';

import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import _ from 'lodash'

import { symbols } from '../../elements'

const style = (theme) => ({
  root: {
    paddingLeft: 2 * theme.spacing.unit,
    paddingRight: 2 * theme.spacing.unit,
    paddingBottom: 2 * theme.spacing.unit,
    height: '100%',
    width: '100%'
  },
  card: {
    height: '100%',
    width: '100%',
    cursor: 'pointer'
  },
  media: {
    width: '100%',
    height: 24 * theme.spacing.unit,
    backgroundColor: theme.palette.grey[300]
  }
});

let Image = (src) => {
  if (src) {
    return (
      <img style={{objectFit: 'cover', width: '100%', height: '100%'}} src={src} alt=''/>
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
    if (!_.isNil(this.props.mdbId)) {
      id = this.props.mdbId;
    }

    this.props.dispatch(push(`/dataset/${id}`))
  }

  render = () => {
    let imageUrl = null;
    const { classes } = this.props;
    if (!_.isNil(this.props.imageFileId)) {
      imageUrl = `${window.location.origin}/api/v1/file/${this.props.imageFileId}/download`;
    }
    const species = this.props.atomicSpecies.map((an) => symbols[an]).join(', ');
    const speciesText = `Atomic Species: ${species}`;
    return (
      <div className={classes.root}>
        <Card onClick={this.onClickHandler} className={classes.card}>
          <CardContent>
            <Typography gutterBottom variant="body1" color="textSecondary"  noWrap>
              {speciesText}
            </Typography>
          </CardContent>
          <div className={classes.media} >
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
      </div>
    );
  }
}

SearchResult.propTypes = {
  _id: PropTypes.string,
  mdbId: PropTypes.string,
  title: PropTypes.string,
  authors: PropTypes.array,
  imageFileId:  PropTypes.string,
  public: PropTypes.bool,
  atomicSpecies: PropTypes.array
}

SearchResult.defaultProps = {
  public: false,
  mdbId: null,
  atomicSpecies: []
}

function mapStateToProps(state) {
  return {};
}

SearchResult = withStyles(style)(SearchResult);
export default connect(mapStateToProps)(SearchResult)
