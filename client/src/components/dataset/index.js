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

import selectors from '../../redux/selectors';
import { symbols } from '../../elements'
import StructureContainer from '../../containers/structure'


const style = {
  //height: '100%',
  width: '90%',
  margin: 20,
  textAlign: 'center',
  //display: 'inline-block',
};

const cardHeaderStyle = {
  textAlign: 'left'
}

const cardMediaStyle = {
  textAlign: 'right',
  display: 'inline-block',
  margin: 20,
  width: '100%'
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

const tableStyle = {
  fontSize: '18px'
}
const tableLabelStyle = {
  fontSize: '18px',
  color: '#9E9E9E'
}

class Dataset extends Component {

  render = () => {
    const species = this.props.atomicSpecies.map((an) => symbols[an]).join(', ');
    const authors = this.props.authors.join(' and ');
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
                        Paper
                      </TableRowColumn>
                      <TableRowColumn style={{...tableStyle}}>
                        <a href={this.props.url}>
                          {this.props.url}
                        </a>
                      </TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn style={{...tableLabelStyle}}>
                        Reconstruction
                      </TableRowColumn>
                      <TableRowColumn style={{...tableStyle}}>
                        <IconMenu
                          iconButtonElement={<IconButton><FileFileDownload /></IconButton>}
                        >
                          <MenuItem
                            value="tiff"
                            primaryText="TIFF"
                            href={`${window.location.origin}/api/v1/file/${this.props.tiffFileId}/download`}
                          />
                          <MenuItem
                            value="emd"
                            primaryText="EMD"
                            href={`${window.location.origin}/api/v1/file/${this.props.emdFileId}/download`}
                          />
                        </IconMenu>
                      </TableRowColumn>
                    </TableRow>
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
                            href={`${window.location.origin}/api/v1/file/${this.props.xyzFileId}/download`}
                          />
                          <MenuItem
                            value="cjson"
                            primaryText="CJSON"
                            href={`${window.location.origin}/api/v1/file/${this.props.cjsonFileId}/download`}
                          />
                          <MenuItem
                            value="cml"
                            primaryText="CML"
                            href={`${window.location.origin}/api/v1/file/${this.props.cmlFileId}/download`}
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
}

Dataset.defaultProps = {
  title: '',
  authors: [],
  imageFileId:  null,
  atomicSpecies: [],
  url: null
}


function mapStateToProps(state, ownProps) {
  let props = {};
  if (!_.isNull(ownProps._id)) {
    let structures = selectors.structures.getStructuresById(state);
    if (_.has(structures, ownProps._id)) {
      // For now we only have a single structure, so just pick the first.
      const structure = structures[ownProps._id][0];
      props = {
        cjsonFileId: structure.cjsonFileId,
        xyzFileId: structure.xyzFileId,
        cmlFileId: structure.cmlFileId,
      }
    }

    let reconstructions = selectors.reconstructions.getReconstructionsById(state);
    if (_.has(reconstructions, ownProps._id)) {
      // For now we only have a single reconstruction, so just pick the first.
      const reconstruction = reconstructions[ownProps._id][0];
      props = {
        ...props,
        emdFileId: reconstruction.emdFileId,
        tiffFileId: reconstruction.tiffFileId
      }
    }
  }

  return props;
}

export default connect(mapStateToProps)(Dataset)
