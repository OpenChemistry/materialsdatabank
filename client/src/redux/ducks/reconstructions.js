import { createAction, handleActions } from 'redux-actions';

// Actions
export const LOAD_RECONSTRUCTIONS   = 'LOAD_RECONSTRUCTIONS';
export const REQUEST_RECONSTRUCTIONS = 'REQUEST_RECONSTRUCTIONS';
export const RECEIVE_RECONSTRUCTIONS   = 'RECEIVE_RECONSTRUCTIONS';


export const initialState = {
    byTomoId: {},
    error: null,
  };

// Reducer
const reducer = handleActions({
  REQUEST_RECONSTRUCTIONS: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECEIVE_RECONSTRUCTIONS: (state, action) => {
    const reconstructions = action.payload.reconstructions;
    const tomoId = action.payload.tomoId;
    const byTomoId = {
      ...state.byTomId,
      [tomoId]: reconstructions
    }

    return {...state,  byTomoId };
  },
}, initialState);

// Action Creators

// Fetch reconstructions
export const loadReconstructions = createAction(LOAD_RECONSTRUCTIONS, (id) => ({ id }));

export const requestReconstructions = createAction(REQUEST_RECONSTRUCTIONS, (id) => ({ id }));

export const receiveReconstructions = createAction(RECEIVE_RECONSTRUCTIONS,
    (tomoId, reconstructions) => ({tomoId, reconstructions }));


export default reducer;
