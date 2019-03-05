import { createAction, handleActions } from 'redux-actions';
import _ from 'lodash';

// Actions
export const SEARCH_DATASETS_BY_TEXT   = 'SEARCH_DATASETS__BY_TEXT';
export const SEARCH_DATASETS_BY_FIELDS   = 'SEARCH_DATASETS__BY_FIELDS';
export const SEARCH_DATASETS_BY_ME   = 'SEARCH_DATASETS_BY_ME';
export const REQUEST_DATASETS_BY_FIELDS   = 'REQUEST_DATASETS_BY_FIELDS';
export const REQUEST_DATASETS_BY_TEXT   = 'REQUEST_DATASETS_BY_TEXT';
export const REQUEST_DATASETS_BY_ME   = 'REQUEST_DATASETS_BY_ME';
export const RECEIVE_DATASETS   = 'RECEIVE_DATASETS';

export const SELECT_MOLECULE = 'SELECT_DATASET';

export const LOAD_DATASET_BY_ID   = 'LOAD_DATASET_BY_ID';
export const REQUEST_DATASET_BY_ID = 'REQUEST_DATASET_BY_ID';
export const REQUEST_DATASET   = 'REQUEST_DATASET';
export const RECEIVE_DATASET   = 'RECEIVE_DATASET';

export const TOGGLE_EDITABLE = 'TOGGLE_EDITABLE';
export const REQUEST_TOGGLE_EDITABLE = 'REQUEST_TOGGLE_EDITABLE';

export const DELETE_DATASET   = 'DELETE_DATASET';
export const REQUEST_DATASET_DELETE   = 'REQUEST_DATASET_DELETE';
export const DATASET_DELETED   = 'DATASET_DELETED';


export const initialState = {
    search: {
      results: [],
    },
    byId: {},
    mdbIdToId: {},
    error: null,
  };

// Reducer
const reducer = handleActions({
  [REQUEST_DATASETS_BY_TEXT]: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  [REQUEST_DATASETS_BY_FIELDS]: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  [REQUEST_DATASETS_BY_ME]: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  [RECEIVE_DATASETS]: (state, action) => {
    const results = action.payload.search.results;
    const search = {...state.search, results}
    return {...state,  search };
  },
  [REQUEST_DATASET_BY_ID]: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  [RECEIVE_DATASET]: (state, action) => {
    const dataset = action.payload.dataset;
    const byId = {...state.byId, [dataset._id]: dataset };
    let mdbIdToId = state.mdbIdToId;
    if (!_.isNil(dataset.mdbId)) {
      mdbIdToId = {...mdbIdToId, [dataset.mdbId]: dataset._id };
    }

    return {...state, byId, mdbIdToId};
  },
  [REQUEST_DATASET_DELETE]: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  [DATASET_DELETED]: (state, action) => {
    const id = action.payload.id;

    const byId = {...state.byId};
    delete byId[id]

    return {...state, byId};
  },
}, initialState);

// Action Creators

// Fetch datasets
export const searchDatasetsByText = createAction(SEARCH_DATASETS_BY_TEXT, (terms) => ({terms}));
export const searchDatasetsByFields = createAction(SEARCH_DATASETS_BY_FIELDS,
    (title, authors, atomicSpecies, mdbId) => ({title, authors, atomicSpecies, mdbId}));
export const searchDatasetsByMe = createAction(SEARCH_DATASETS_BY_ME);

export const requestDatasetsByText = createAction(REQUEST_DATASETS_BY_TEXT);
export const requestDatasetsByFields = createAction(REQUEST_DATASETS_BY_FIELDS);
export const requestDatasetsByMe = createAction(REQUEST_DATASETS_BY_ME);

export const receiveDatasets = createAction(RECEIVE_DATASETS, (results) => ({
  search: {results}
}));

export const loadDatasetById = createAction(LOAD_DATASET_BY_ID, (id) => ({ id }));

export const requestDatasetById = createAction(REQUEST_DATASET_BY_ID, (id) => ({ id }));

export const receiveDataset = createAction(RECEIVE_DATASET, (dataset) => ({ dataset }));

export const toggleEditable = createAction(TOGGLE_EDITABLE);
export const requestToggleEditable = createAction(REQUEST_TOGGLE_EDITABLE);

export const deleteDataset = createAction(DELETE_DATASET, (id, resolve, reject) => ({ id, resolve, reject}));
export const requestDatasetDelete = createAction(REQUEST_DATASET_DELETE);
export const datasetDeleted   = createAction(DATASET_DELETED, (id) => ({ id }));

export default reducer;
