import { createStore, applyMiddleware } from 'redux'
import reducers from '../redux/reducers'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'

const history = createHistory()
const reduxRouterMiddleware = routerMiddleware(history)

export { reducers };

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware, reduxRouterMiddleware]
  if (process.env.NODE_ENV === `development`) {
    middleware.push(logger);
  }

  const store = createStore(
      reducers,
      applyMiddleware(...middleware));

  return {
    ...store,
    runSaga: sagaMiddleware.run,
    history,
  }
}
