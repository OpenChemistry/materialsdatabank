import { createAction, handleActions } from 'redux-actions';

// Actions
export const LOAD_PROJECTIONS   = 'LOAD_PROJECTIONS';
export const REQUEST_PROJECTIONS = 'REQUEST_PROJECTIONS';
export const RECEIVE_PROJECTIONS   = 'RECEIVE_PROJECTIONS';

export const initialState = {
  byDatasetId: {},
  error: null,
};

// Reducer
const reducer = handleActions({
  REQUEST_PROJECTIONS: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECEIVE_PROJECTIONS: (state, action) => {
    const { projections, datasetId } = action.payload;
    const byDatasetId = {
      ...state.byTomId,
      [datasetId]: projections
    }

    return {...state,  byDatasetId };
  },
}, initialState);

// Action Creators

// Fetch projections
export const loadProjections = createAction(LOAD_PROJECTIONS, (id) => ({ id }));

export const requestProjections = createAction(REQUEST_PROJECTIONS, (id) => ({ id }));

export const receiveProjections = createAction(RECEIVE_PROJECTIONS,
    (datasetId, projections) => ({datasetId, projections }));


export default reducer;
