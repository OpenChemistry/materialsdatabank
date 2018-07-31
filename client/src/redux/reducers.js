import { combineReducers } from 'redux';
import datasets  from './ducks/datasets';
import structures  from './ducks/structures';
import reconstructions  from './ducks/reconstructions';
import girder from './ducks/girder';
import app from './ducks/app';
import upload from './ducks/upload';

import { reducer as formReducer } from 'redux-form'

export default combineReducers({
  datasets,
  structures,
  reconstructions,
  girder,
  app,
  upload,
  form: formReducer
});
