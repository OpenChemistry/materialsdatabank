import React, { Component } from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import { connect } from 'react-redux'
import _ from 'lodash'
import RaisedButton from 'material-ui/RaisedButton';
import Done from 'material-ui/svg-icons/action/done';

import selectors from '../../redux/selectors';
import { symbols } from '../../elements'
import StructureContainer from '../../containers/structure'
import { approveDataSet } from '../../redux/ducks/upload';
import { setProgress } from '../../redux/ducks/app';

import './index.css'

const privateColor = '#FFEBEE'

const cardHeaderStyle = {
  textAlign: 'left'
}

const infoStyle = {
    textAlign: 'left'
}

const titleStyle = {
    fontSize: '25px'
}

const subtitleStyle = {
    fontSize: '15px'
}


const tableLabelStyle = {
  fontSize: '18px',
  color: '#9E9E9E'
}

const approveButtonStyle = {
  float: 'right',
  margin: '20px'
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

const textDivStyle = {
  width: '300px',
  margin: '20px',
  float: 'left'
}

class Dataset extends Component {

  constructor(props) {
    super(props);
    this.state = {
        approving: false
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
        <Card style={style} zDepth={2} >
          <CardHeader
            style={cardHeaderStyle}
            title={this.props.title}
            titleStyle={titleStyle}
            subtitleStyle={subtitleStyle}
            subtitle={authors}
          />
          <CardMedia style={cardMediaStyle}>
            <GridList
              cellHeight={'auto'}
              cols={3}
            >
              <GridTile
                key={'info'}
                cols={1}
                style={infoStyle}
              >
                <Table
                  selectable={false}
                >
                  <TableBody
                    displayRowCheckbox={false}
                  >
                    <TableRow>
                      <TableRowColumn style={{...tableLabelStyle}}>
                        Atomic Species
                      </TableRowColumn>
                      <TableRowColumn style={{...tableStyle}}>
                        {species}
                      </TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn style={{...tableLabelStyle}}>
                        License
                      </TableRowColumn>
                      <TableRowColumn style={{...tableStyle}}>
                        <a href={"https://creativecommons.org/licenses/by/4.0/"}>
                          CC BY 4
                        </a>
                      </TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn style={{...tableLabelStyle}}>
                        DOI
                      </TableRowColumn>
                      <TableRowColumn style={{...tableStyle}}>
                        <a href={`https://dx.doi.org/${this.props.url}`}>
                          {this.props.url}
                        </a>
                      </TableRowColumn>
                    </TableRow>
                    { (!_.isNil(this.props.reconstruction.tiffFileId) || !_.isNil(this.props.reconstruction.emdFileId)) &&
                    <TableRow>
                      <TableRowColumn style={{...tableLabelStyle}}>
                        Reconstruction
                      </TableRowColumn>
                      <TableRowColumn style={{...tableStyle}}>
                        <IconMenu
                          iconButtonElement={<IconButton><FileFileDownload /></IconButton>}
                        >
                          { !_.isNil(this.props.reconstruction.tiffFileId) &&
                          <MenuItem
                            value="tiff"
                            primaryText="TIFF"
                            href={tiffUrl}
                          />
                          }
                          { !_.isNil(this.props.reconstruction.emdFileId) &&
                          <MenuItem
                            value="emd"
                            primaryText="EMD"
                            href={emdUrl}
                          />
                          }
                        </IconMenu>
                      </TableRowColumn>
                    </TableRow>
                    }
                    <TableRow>
                      <TableRowColumn style={{...tableLabelStyle}}>
                        Structure
                      </TableRowColumn>
                      <TableRowColumn style={{...tableStyle}}>
                        <IconMenu
                          iconButtonElement={<IconButton><FileFileDownload /></IconButton>}
                        >
                          <MenuItem
                            value="xyz"
                            primaryText="XYZ"
                            href={`${structureUrl}/xyz`}
                          />
                          <MenuItem
                            value="cjson"
                            primaryText="CJSON"
                            href={`${structureUrl}/cjson`}
                          />
                          <MenuItem
                            value="cml"
                            primaryText="CML"
                            href={`${structureUrl}/cml`}
                          />
                        </IconMenu>
                      </TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
              </GridTile>
              <GridTile
                key={'structure'}
                cols={2}
              >
                <StructureContainer _id={this.props._id}/>
              </GridTile>
            </GridList>
          </CardMedia>
          { !this.props.public &&
          <div style={approvalDivStyle}>
            <div style={textDivStyle} className={'mdb-text'}>This dataset is awaiting approval.</div>
            { this.props.isCurator &&
            <RaisedButton
              disabled={this.state.approving}
              style={approveButtonStyle}
              label="Approve"
              labelPosition="after"
              primary={true}
              icon={<Done />}
              onClick={() => this.approve()}
            />
            }
          </div>
          }
        </Card>

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
