import React from 'react';
import ReactDOM from 'react-dom';
//import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router'

import './index.css';
import configureStore from './store/configureStore'
import rootSaga from './sagas'
import Header from './components/header';
import Footer from './components/footer';
import Main from './components/main';
import SideBar from './components/sidebar';
import TomoContainer from './containers/tomo'
import Welcome from './components/welcome'


const store = configureStore()
store.runSaga(rootSaga)

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const style = {
  display: 'flex'
}

ReactDOM.render(
    <MuiThemeProvider >
      <Provider store={store}>
        <ConnectedRouter history={store.history}>
          <div>
           <Header />
           <SideBar />
            <div style={style}>
              <Route exact path='/' component={Main}/>
              <Route exact path='/tomo/:id' component={TomoContainer}/>
              <Route exact path='/welcome' component={Welcome}/>
            </div>
           <Footer />
          </div>
        </ConnectedRouter>
      </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
  );

//registerServiceWorker();
