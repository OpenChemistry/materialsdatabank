import React from 'react';
import ReactDOM from 'react-dom';
//import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; // v1.x
import CssBaseline from '@material-ui/core/CssBaseline';
import teal from '@material-ui/core/colors/teal';
import pink from '@material-ui/core/colors/pink';

import { Provider } from 'react-redux';
import Cookies from 'universal-cookie';
import _ from 'lodash'

import './index.css';
import configureStore from './store/configureStore'
import rootSaga from './sagas'
import { authenticate } from './redux/ducks/girder'

import App from './App';

import { defineCustomElements as defineMolecule } from  '@openchemistry/molecule-moljs';

defineMolecule(window);


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
    width: 150,
    paddingLeft: 3,
    paddingRight: 3
  },
  drawer: {
    width: 240,
    backgroundColor: '#37474F'
  }
});

const cookies = new Cookies();
const cookieToken = cookies.get('girderToken');
if (!_.isNil(cookieToken)) {
  store.dispatch(authenticate(cookieToken));
}

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <App/>
    </MuiThemeProvider>
  </Provider>
  ,
  document.getElementById('root')
);

//registerServiceWorker();
