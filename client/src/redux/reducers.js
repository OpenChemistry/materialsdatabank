import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import tomos  from './ducks/tomos';
import structures  from './ducks/structures';
import reconstructions  from './ducks/reconstructions';
import { reducer as formReducer } from 'redux-form'

export default combineReducers({
  router: routerReducer,
  tomos,
  structures,
  reconstructions,
  form: formReducer
});
