import { createAction, handleActions } from 'redux-actions';

// Actions
export const LOAD_JOB = 'LOAD_JOB';
export const REQUEST_JOB = 'REQUEST_JOB';
export const RECEIVE_JOB = 'RECEIVE_JOB';


export const initialState = {
  byId: {},
  error: null
};

// Reducer
const reducer = handleActions({
  REQUEST_JOB: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECEIVE_JOB: (state, action) => {
    const job = action.payload;
    const byId = {...state.byId, [job._id]: job };
    return {...state, byId};
  }
}, initialState);

// Action Creators
export const loadJob = createAction(LOAD_JOB);
export const requestJob = createAction(REQUEST_JOB);
export const receiveJob = createAction(RECEIVE_JOB);

export default reducer;
