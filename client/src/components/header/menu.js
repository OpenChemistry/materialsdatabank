import React, { Component } from 'react';
import { connect } from 'react-redux'

import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover, { PopoverAnimationVertical } from '@material-ui/core/Popover';

import Button from '@material-ui/core/Button';
import DropDownIcon from '@material-ui/icons/ArrowDropDown';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import selectors from '../../redux/selectors';
import { invalidateToken } from '../../redux/ducks/girder'

class Menu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleTouchTap = (event) => {

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  handleSignOut = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.props.dispatch(invalidateToken())
  };

  render = () => {
    const {me} = this.props;

    return (
        <div>
          <Button onClick={this.handleTouchTap}>
            {me ? me.login : 'user' }
            <DropDownIcon />
          </Button>
          {/* <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            onClose={this.handleRequestClose}
            animation={PopoverAnimationVertical}
          >
            <MenuList>
              <MenuItem onClick={this.handleSignOut} >
                <ExitToAppIcon/>
                Sign out
              </MenuItem>
            </MenuList>
          </Popover> */}
        </div>

    );
  }
}

function mapStateToProps(state, ownProps) {
  const me = selectors.girder.getMe(state);

  return {
    me,
  }
}

export default connect(mapStateToProps)(Menu)

