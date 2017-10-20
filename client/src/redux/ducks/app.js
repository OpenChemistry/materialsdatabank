import { createAction, handleActions } from 'redux-actions';

// Actions
export const SELECT_AUTH_PROVIDER = 'SELECT_AUTH_PROVIDER';
export const SET_AUTH_PROVIDER = 'SET_AUTH_PROVIDER';
export const SET_PROGRESS = 'SET_PROGRESS';

export const initialState = {
  selectAuthProvider: false,
  authProvider: null,
  progress: false
};

// Reducer
const reducer = handleActions({
  SELECT_AUTH_PROVIDER: (state, action) => {
    const selectAuthProvider = action.payload;
    return {...state, selectAuthProvider };
  },
  SET_AUTH_PROVIDER: (state, action) => {
    const authProvider = action.payload.provider;
    return {...state, authProvider };
  },
  SET_PROGRESS: (state, action) => {
    const progress = action.payload.progress;
    return {...state, progress };
  },

  throw: (state, action) => state
}, initialState);

// Action Creators
export const selectAuthProvider = createAction(SELECT_AUTH_PROVIDER);
export const setAuthProvider = createAction(SET_AUTH_PROVIDER,  (provider) => ({ provider }));
export const setProgress = createAction(SET_PROGRESS,  (progress) => ({ progress }));

export default reducer;
