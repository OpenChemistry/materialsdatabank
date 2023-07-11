import React, {Component} from 'react';

import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
// import { Routes, Route } from 'react-router'
import { history } from './store/configureStore';

import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

import Header from './components/header';
import Footer from './components/footer';
import SearchResults from './containers/searchresults';
import SideBar from './components/sidebar';
import DatasetContainer from './containers/dataset'
import Welcome from './components/welcome'
import Search from './components/search'
import { SelectLoginProvider, OauthRedirect } from './components/oauth'
import Deposit from './components/deposit'
import Contact from './components/contact';
import Software from './components/software';
import Tutorials from './components/tutorials';

import { withStyles } from '@material-ui/core/styles';
import Aet from './components/tutorials/aet';
import Validation from './components/validation';
import Download from './components/download';
import AetGeneralComponent from './components/tutorials/aetGeneral';
import VisualizingComponent from './components/tutorials/visualizing';
import ReferencesComponent from './components/tutorials/references';
import MyDataSetsComponent from './containers/my-datasets';
import PrivateRoute from './containers/private-route';

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
                {/* <Routes> */}
                  <Route exact path='/' component={Welcome}/>
                  <PrivateRoute exact path='/my-datasets' component={MyDataSetsComponent}/>
                  <Route exact path='/dataset/:id' component={DatasetContainer}/>
                  <Route exact path='/dataset/:id/:action(edit)' component={Deposit}/>
                  <Route exact path='/welcome' component={Welcome}/>
                  <Route exact path='/search' component={Search}/>
                  <Route exact path='/results' component={SearchResults}/>
                  <PrivateRoute exact path='/:action(deposit)' component={Deposit}/>
                  <Route exact path='/contact' component={Contact}/>
                  <Route exact path='/software' component={Software}/>
                  <Route exact path='/tutorials/aet-general' component={AetGeneralComponent}/>
                  <Route exact path='/tutorials/aet' component={Aet}/>
                  <Route exact path='/tutorials/references' component={ReferencesComponent}/>
                  <Route exact path='/tutorials/visualizing' component={VisualizingComponent}/>
                  <Route exact path='/tutorials' component={Tutorials}/>
                  <Route exact path='/download' component={Download}/>
                  <Route exact path='/validation' component={Validation}/>
                {/* </Routes> */}

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
