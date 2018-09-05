import React from 'react';
import ReactDOM from 'react-dom';
//import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; // v1.x
import CssBaseline from '@material-ui/core/CssBaseline';
import teal from '@material-ui/core/colors/teal';
import pink from '@material-ui/core/colors/pink';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
import Cookies from 'universal-cookie';
import _ from 'lodash'

import './index.css';
import configureStore from './store/configureStore'
import rootSaga from './sagas'
import Header from './components/header';
import Footer from './components/footer';
import Main from './components/main';
import SideBar from './components/sidebar';
import DatasetContainer from './containers/dataset'
import Welcome from './components/welcome'
import Search from './components/search'
import { SelectLoginProvider, OauthRedirect } from './components/oauth'
import { authenticate, loadCuratorGroup } from './redux/ducks/girder'
import Deposit from './components/deposit'

import * as Molecule from  '@openchemistry/molecule-moljs';

Molecule.defineCustomElements(window);


const store = configureStore()
store.runSaga(rootSaga)

const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[400]
    },
    secondary: pink,
  },
  pageHead: {
    paddingTop: 4,
    paddingBottom: 14
  },
  pageBody: {
    marginTop: -13
  },
  pageContent: {
    width: 120
  }
});

const cookies = new Cookies();
const cookieToken = cookies.get('girderToken');
if (!_.isNil(cookieToken)) {
  store.dispatch(authenticate(cookieToken));
}

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <div className="fill">
      <CssBaseline/>
      <Provider store={store}>
        <ConnectedRouter history={store.history}>
        <div className="app-container">
          <div className="header-container">
            <Header />
          </div>
          <div className="body-container">
            <div className="sidebar-container">
              <SideBar />
            </div>
            <div className="content-wrapper">
              <div className="content-container">
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
              <div className="footer-container">
                <Footer />
              </div>
            </div>
          </div>
          <OauthRedirect/>
          <SelectLoginProvider/>
        </div>
        </ConnectedRouter>
      </Provider>
    </div>
  </MuiThemeProvider>
  ,
  document.getElementById('root')
);

//registerServiceWorker();
