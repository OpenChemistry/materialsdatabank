import React, {Component} from 'react';

import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
import { history } from './store/configureStore';
import _ from 'lodash'

import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

import Header from './components/header';
import Footer from './components/footer';
import Main from './components/main';
import SideBar from './components/sidebar';
import DatasetContainer from './containers/dataset'
import Welcome from './components/welcome'
import Search from './components/search'
import { SelectLoginProvider, OauthRedirect } from './components/oauth'
import Deposit from './components/deposit'

import { withStyles } from '@material-ui/core/styles';

const appStyles = theme => ({
  root: {
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: theme.drawer.width,
    backgroundColor: theme.drawer.backgroundColor,
  },
  body: {
    display: 'flex',
    flexGrow: 1
  },
  contentContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flexGrow:1
  },
  footer: {

  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openSideBar: false
    }
  }

  toggleSideBar = () => {
    this.setState({...this.state, openSideBar: !this.state.openSideBar});
  }

  render() {
    const {classes} = this.props;
    return (
      <ConnectedRouter history={history}>
        <div className={classes.root}>
          <Header onToggleMenu={this.toggleSideBar}/>
          <div className={classes.body}>
            {/* Desktop side menu */}
            <Hidden smDown>
              <Drawer
                variant='persistent'
                open
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                <SideBar />
              </Drawer>
            </Hidden>

            {/* Mobile side menu */}
            <Hidden mdUp>
              <Drawer
                variant='temporary'
                anchor={'left'}
                open={this.state.openSideBar}
                onClose={this.toggleSideBar}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                <SideBar onLinkClick={this.toggleSideBar} />
              </Drawer>
            </Hidden>
            <div className={classes.contentContainer}>
              <div className={classes.content}>
                <Switch>
                  <Route exact path='/' component={Welcome}/>
                  <Route exact path='/dataset/:id' component={DatasetContainer}/>
                  <Route exact path='/dataset/:id/:action(edit)' component={Deposit}/>
                  <Route exact path='/welcome' component={Welcome}/>
                  <Route exact path='/search' component={Search}/>
                  <Route exact path='/results' component={Main}/>
                  <Route exact path='/:action(deposit)' component={Deposit}/>
                </Switch>
              </div>
              <div className={classes.footer}>
                <Footer />
              </div>
              <OauthRedirect/>
              <SelectLoginProvider/>
            </div>
          </div>
        </div>
        </ConnectedRouter>
    );
  }
}

export default withStyles(appStyles)(App);
