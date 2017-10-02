import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import tomos  from './ducks/tomos';

export default combineReducers({
  router: routerReducer,
  tomos
});
