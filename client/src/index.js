import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router'

import './index.css';
import configureStore from './store/configureStore'
import rootSaga from './sagas'
import Header from './components/header';
import Main from './components/main';


const store = configureStore()
store.runSaga(rootSaga)

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

console.log(ConnectedRouter)

ReactDOM.render(
    <MuiThemeProvider >
      <Provider store={store}>
        <ConnectedRouter history={store.history}>
          <div>
           <Header />
            <div>
              <Route exact path='/' component={Main}/>
            </div>
          </div>
        </ConnectedRouter>
      </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
  );

registerServiceWorker();
