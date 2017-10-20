import { createAction, handleActions } from 'redux-actions';

// Actions
export const LOAD_STRUCTURES   = 'LOAD_STRUCTURES';
export const REQUEST_STRUCTURES = 'REQUEST_STRUCTURES';
export const RECEIVE_STRUCTURES   = 'RECEIVE_STRUCTURES';


export const initialState = {
    byDatasetId: {},
    error: null,
  };

// Reducer
const reducer = handleActions({
  REQUEST_STRUCTURES: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECEIVE_STRUCTURES: (state, action) => {
    const structures = action.payload.structures;
    const datasetId = action.payload.datasetId;
    const byDatasetId = {
      ...state.byDatasetId,
      [datasetId]: structures
    }

    return {...state,  byDatasetId };
  },
}, initialState);

// Action Creators

// Fetch structures
export const loadStructures = createAction(LOAD_STRUCTURES, (id) => ({ id }));

export const requestStructures = createAction(REQUEST_STRUCTURES, (id) => ({ id }));

export const receiveStructures = createAction(RECEIVE_STRUCTURES,
    (datasetId, structures) => ({datasetId, structures }));


export default reducer;
