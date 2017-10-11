import { createAction, handleActions } from 'redux-actions';

// Actions
export const SEARCH_TOMOS_BY_TEXT   = 'SEARCH_TOMOS__BY_TEXT';
export const SEARCH_TOMOS_BY_FIELDS   = 'SEARCH_TOMOS__BY_FIELDS';
export const REQUEST_TOMOS_BY_FIELDS   = 'REQUEST_TOMOS_BY_FIELDS';
export const REQUEST_TOMOS_BY_TEXT   = 'REQUEST_TOMOS_BY_TEXT';
export const RECEIVE_TOMOS   = 'RECEIVE_TOMOS';

export const SELECT_MOLECULE = 'SELECT_TOMO';

export const LOAD_TOMO_BY_ID   = 'LOAD_TOMO_BY_ID';
export const REQUEST_TOMO_BY_ID = 'REQUEST_TOMO_BY_ID';
export const REQUEST_TOMO   = 'REQUEST_TOMO';
export const RECEIVE_TOMO   = 'RECEIVE_TOMO';


export const initialState = {
    search: {
      results: [],
    },
    byId: {},
    error: null,
  };

// Reducer
const reducer = handleActions({
  REQUEST_TOMOS_BY_TEXT: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  REQUEST_TOMOS_BY_FIELDS: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECEIVE_TOMOS: (state, action) => {
    const results = action.payload.search.results;
    const search = {...state.search, results}
    return {...state,  search };
  },
  REQUEST_TOMO_BY_ID: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECEIVE_TOMO: (state, action) => {
    const tomo = action.payload.tomo;
    const byId = {...state.byId, [tomo._id]: tomo };

    return {...state, byId};
  }
}, initialState);

// Action Creators

// Fetch tomos
export const searchTomosByText = createAction(SEARCH_TOMOS_BY_TEXT, (terms) => ({terms}));
export const searchTomosByFields = createAction(SEARCH_TOMOS_BY_FIELDS,
    (title, authors, atomicSpecies) => ({title, authors, atomicSpecies}));

export const requestTomosByText = createAction(REQUEST_TOMOS_BY_TEXT);
export const requestTomosByFields = createAction(REQUEST_TOMOS_BY_FIELDS);

export const receiveTomos = createAction(RECEIVE_TOMOS, (results) => ({
  search: {results}
}));

export const loadTomoById = createAction(LOAD_TOMO_BY_ID, (id) => ({ id }));

export const requestTomoById = createAction(REQUEST_TOMO_BY_ID, (id) => ({ id }));

export const receiveTomo = createAction(RECEIVE_TOMO, (tomo) => ({ tomo }));


export default reducer;
