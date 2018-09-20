import { createStore, applyMiddleware } from 'redux'
import { createBrowserHistory } from 'history'
import {default as reducersIn} from '../redux/reducers'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'
import { routerMiddleware, connectRouter } from 'connected-react-router'

export const history = createBrowserHistory();

const reducers = connectRouter(history)(reducersIn);
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
