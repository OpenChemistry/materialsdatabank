import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import datasets  from './ducks/datasets';
import structures  from './ducks/structures';
import reconstructions  from './ducks/reconstructions';
import { reducer as formReducer } from 'redux-form'

export default combineReducers({
  router: routerReducer,
  datasets,
  structures,
  reconstructions,
  form: formReducer
});
