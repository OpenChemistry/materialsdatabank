import { createAction, handleActions } from 'redux-actions';

// Actions
export const SEARCH_TOMOS   = 'SEARCH_TOMOS';
export const REQUEST_TOMOS   = 'REQUEST_TOMOS';
export const RECEIVE_TOMOS   = 'RECEIVE_TOMOS';

export const SELECT_MOLECULE = 'SELECT_TOMO';

export const initialState = {
    search: {
      results: [],
    },
    byId: {},
    error: null,
  };

// Reducer
const reducer = handleActions({
  REQUEST_TOMOS: (state, action) => {
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
  }
}, initialState);

// Action Creators

// Fetch tomos
export const searchTomos = createAction(SEARCH_TOMOS, (terms) => ({terms}));

export const requestTomos = createAction(REQUEST_TOMOS);

export const receiveTomos = createAction(RECEIVE_TOMOS, (results) => ({
  search: {results}
}));


export default reducer;
