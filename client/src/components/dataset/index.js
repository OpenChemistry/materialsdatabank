import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import DoneIcon from '@material-ui/icons/Done';
import DownloadIcon from '@material-ui/icons/CloudDownload';

import PropTypes from 'prop-types';

import { connect } from 'react-redux'
import _ from 'lodash'

import selectors from '../../redux/selectors';
import { symbols } from '../../elements'
import StructureContainer from '../../containers/structure'
import { approveDataSet } from '../../redux/ducks/upload';
import { setProgress } from '../../redux/ducks/app';

import PageHead from '../page-head';
import PageBody from '../page-body';

import './index.css'

const privateColor = '#FFEBEE'

const cardHeaderStyle = {
  textAlign: 'left'
}

const infoStyle = {
    textAlign: 'left'
}

const tableLabelStyle = {
  fontSize: '18px',
  color: '#9E9E9E'
}

const cardMediaStyle = {
    textAlign: 'right',
    display: 'inline-block',
    margin: 20,
    width: '100%'
  }

const style = {
    //height: '100%',
    width: '90%',
    margin: 20,
    textAlign: 'center',
    //display: 'inline-block',
  };

const tableStyle = {
    fontSize: '18px'
  }

const approvalDivStyle = {
  display: 'inline'
}

class Dataset extends Component {

  constructor(props) {
    super(props);
    this.state = {
        approving: false,
        reconstructionMenu: {
          anchor: null,
          open: false
        },
        structureMenu: {
          anchor: null,
          open: false
        }
    }
  }

  approve = () => {
    this.props.dispatch(setProgress(true));
    this.props.dispatch(approveDataSet(this.props._id));
    this.setState({
      approving: true
    })
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.public && this.state.approving) {
      this.props.dispatch(setProgress(false));
      this.setState({
        approving: false
      });
    }
  }

  handleClick = (key, anchor) => {
    this.setState({[key]: {anchor: anchor}});
  };

  handleClose = () => {
    this.setState({reconstructionMenu: {anchor: null}, structureMenu: {anchor: null}, });
  };

  render = () => {
    const species = this.props.atomicSpecies.map((an) => symbols[an]).join(', ');
    const authors = this.props.authors.join(' and ');


    let structureUrl =  '';
    if (!_.isNil(this.props.structure)) {
        structureUrl = `${window.location.origin}/api/v1/mdb/datasets/_/structures/${this.props.structure._id}`
    }

    let emdUrl = '';
    let tiffUrl = '';
    if (!_.isNil(this.props.reconstruction)) {
      emdUrl = `${window.location.origin}/api/v1/mdb/datasets/_/reconstructions/${this.props.reconstruction._id}/emd`
      tiffUrl = `${window.location.origin}/api/v1/mdb/datasets/_/reconstructions/${this.props.reconstruction._id}/tiff`
    }

    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            {this.props.title}
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
            {authors}
          </Typography>
        </PageHead>
        <PageBody>
          <Card>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell style={{...tableLabelStyle}}>
                      Atomic Species
                    </TableCell>
                    <TableCell style={{...tableStyle}}>
                      {species}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{...tableLabelStyle}}>
                      License
                    </TableCell>
                    <TableCell style={{...tableStyle}}>
                      <a href={"https://creativecommons.org/licenses/by/4.0/"}>
                        CC BY 4
                      </a>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{...tableLabelStyle}}>
                      DOI
                    </TableCell>
                    <TableCell style={{...tableStyle}}>
                      <a href={`https://dx.doi.org/${this.props.url}`}>
                        {this.props.url}
                      </a>
                    </TableCell>
                  </TableRow>
                  { (!_.isNil(this.props.reconstruction.tiffFileId) || !_.isNil(this.props.reconstruction.emdFileId)) &&
                  <TableRow>
                    <TableCell style={{...tableLabelStyle}}>
                      Reconstruction
                    </TableCell>
                    <TableCell style={{...tableStyle}}>
                      <IconButton
                        aria-label="More"
                        aria-owns={this.state.reconstructionMenu.anchor ? 'reconstruction-menu' : null}
                        aria-haspopup="true"
                        onClick={(e) => {this.handleClick('reconstructionMenu', e.currentTarget)}}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <Menu
                        id="reconstruction-menu"
                        anchorEl={this.state.reconstructionMenu.anchor}
                        open={Boolean(this.state.reconstructionMenu.anchor)}
                        onClose={this.handleClose}
                      >
                        { !_.isNil(this.props.reconstruction.tiffFileId) &&
                        <MenuItem
                          value="tiff"
                          onClick={this.handleClose}
                        >
                          <a href={tiffUrl}>TIFF</a>
                        </MenuItem>
                        }
                        { !_.isNil(this.props.reconstruction.emdFileId) &&
                        <MenuItem
                          value="emd"
                          onClick={this.handleClose}
                        >
                          <a href={emdUrl}>EMD</a>
                        </MenuItem>
                        }
                      </Menu>
                    </TableCell>
                  </TableRow>
                  }
                  <TableRow>
                    <TableCell style={{...tableLabelStyle}}>
                      Structure
                    </TableCell>
                    <TableCell style={{...tableStyle}}>
                      <IconButton
                        aria-label="More"
                        aria-owns={this.state.structureMenu.anchor ? 'structure-menu' : null}
                        aria-haspopup="true"
                        onClick={(e) => {this.handleClick('structureMenu', e.currentTarget)}}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <Menu
                        id="structure-menu"
                        anchorEl={this.state.structureMenu.anchor}
                        open={Boolean(this.state.structureMenu.anchor)}
                        onClose={this.handleClose}
                      >
                        <MenuItem
                          value="xyz"
                          onClick={this.handleClose}
                        >
                          <a href={`${structureUrl}/xyz`}>XYZ</a>
                        </MenuItem>
                        <MenuItem
                          value="cjson"
                          onClick={this.handleClose}
                        >
                          <a href={`${structureUrl}/cjson`}>CJSON</a>
                        </MenuItem>
                        <MenuItem
                          value="cml"
                          onClick={this.handleClose}
                        >
                          <a href={`${structureUrl}/cml`}>CML</a>
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div style={{width: '100%', height: '30rem'}}>
                <StructureContainer _id={this.props._id}/>
              </div>
              { !this.props.public &&
              <div style={{textAlign: 'justify', display: 'flex', alignItems: 'center'}}>
                <Typography color="textSecondary" style={{flexGrow: 1}}>* This dataset is awaiting approval.</Typography>
                { this.props.isCurator &&
                <Button
                  variant="contained"
                  color="primary"
                  disabled={this.state.approving}
                  onClick={() => this.approve()}
                >
                  <DoneIcon/>
                  Approve
                </Button>
                }
              </div>
              }
            </CardContent>
          </Card>
        </PageBody>
      </div>
    );
  }
}

Dataset.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string,
  authors: PropTypes.array,
  imageFileId:  PropTypes.string,
  url:  PropTypes.string,
  isCurator: PropTypes.bool,
  public: PropTypes.bool,
  reconstruction:PropTypes.object
}

Dataset.defaultProps = {
  title: '',
  authors: [],
  imageFileId:  null,
  atomicSpecies: [],
  url: null,
  isCurator: false,
  public: false,
  reconstruction: {}
}


function mapStateToProps(state, ownProps) {
  let props = {};

  if (!_.isNull(ownProps._id)) {
    let structures = selectors.structures.getStructuresById(state);
    if (_.has(structures, ownProps._id)) {
      // For now we only have a single structure, so just pick the first.
      const structure = structures[ownProps._id][0];
      props = {
        structure,
        public: structure.public
      }
    }

    let reconstructions = selectors.reconstructions.getReconstructionsById(state);
    if (_.has(reconstructions, ownProps._id)) {
      // For now we only have a single reconstruction, so just pick the first.
      const reconstruction = reconstructions[ownProps._id][0];
      props = {...props,
        reconstruction
      }

      if (_.has(reconstruction, 'emdFileId')) {
        props['emdFileId'] = reconstruction.emdFileId
      }

      if (_.has(reconstruction, 'tiffFileId')) {
        props['tiffFileId'] = reconstruction.tiffFileId
      }
    }
  }

  const curatorGroup = selectors.girder.getCuratorGroup(state);
  if (!_.isNil(curatorGroup)) {
    const me = selectors.girder.getMe(state);
    if (!_.isNil(me)) {
      props['isCurator'] = _.includes(me.groups, curatorGroup['_id'])
    }
  }

  return props;
}

export default connect(mapStateToProps)(Dataset)
