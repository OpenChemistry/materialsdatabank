import { createAction, handleActions } from 'redux-actions';

// Actions
export const UPLOAD = 'UPLOAD';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';
export const UPLOAD_REQUEST =  'UPLOAD_REQUEST';
export const UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';
export const UPLOAD_COMPLETE =  'UPLOAD_COMPLETE';
export const REQUEST_MDB_FOLDER = 'REQUEST_MDB_FOLDER';
export const RECEIVE_MDB_FOLDER = 'RECEIVE_MDB_FOLDER';
export const NEW_DATASET = 'NEW_DATASET';
export const CLEAR_NEW_DATASET = 'CLEAR_NEW_DATASET';
export const APPROVE_DATASET = 'APPROVE_DATASET';
export const APPROVE_DATASET_REQUEST = 'APPROVE_DATASET_REQUEST';
export const VALIDATE_DATASET = 'VALIDATE_DATASET';
export const REQUEST_VALIDATE_DATASET = 'REQUEST_VALIDATE_DATASET';

export const initialState = {
    byId: {},
    fileToId: {},
    mdbFolder: null,
    newDataSet: null,
    error: null,
  };

// Reducer
const reducer = handleActions({
  UPLOAD: (state, action) => {
    const {error, ...rest} = state;
    return {...rest};
  },
  UPLOAD_ERROR: (state, action) => {
    const error = action.payload;
    return {...state, error};
  },
  UPLOAD_REQUEST: (state, action) => {
    const file = action.payload.file;
    const id = action.payload.uploadId;
    let upload = {
      file,
    }

    if (action.error) {
      const error = action.error;
      return {...state, error};
    }
    else {
      const byId = {
        ...state.byId,
        [id]: {
          upload,
        }
      }

      const fileToId = {
          ...state.fileToId,
          [file.id]: id,
          newDataSet: null,
      }

      return {...state, byId, fileToId};
    }

  },
  UPLOAD_PROGRESS: (state, action) => {
    const progressEvent = action.payload.progressEvent;
    const offset = action.payload.offset;
    const id = action.payload.uploadId;
    const currentUpload = state.byId[id];
    const progress = offset + progressEvent.loaded;

    const upload = {...currentUpload, progress}
    const byId = {
        ...state.byId,
        [id]: upload,
      }

    return {...state,  byId };
  },
  UPLOAD_COMPLETE: (state, action) => {
    const id = action.payload.id;
    let {[id]: omit, ...byId} = state.byId;

    return {...state,  byId };
  },
  REQUEST_MDB_FOLDER: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECEIVE_MDB_FOLDER: (state, action) => {
    const mdbFolder = action.payload.folder;


    return {...state,  mdbFolder };
  },
  NEW_DATASET: (state, action) => {
    const newDataSet = action.payload.dataSet;

    return {...state,  newDataSet };
  },
  CLEAR_NEW_DATASET: (state, action) => {
    const newDataSet = null;

    return {...state,  newDataSet };
  },
  APPROVE_DATASET_REQUEST: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  }
}, initialState);

// Action Creators

export const upload = createAction(UPLOAD);

export const uploadError = createAction(UPLOAD_ERROR);

export const requestUpload = createAction(UPLOAD_REQUEST, (uploadId, file) => ({ uploadId,  file }));

export const uploadProgress = createAction(UPLOAD_PROGRESS,
    (uploadId, offset, progressEvent) => ({uploadId, offset, progressEvent}));

export const uploadComplete = createAction(UPLOAD_COMPLETE,
    (id) => ({id}));

export const requestMdbFolder = createAction(REQUEST_MDB_FOLDER);
export const receiveMdbFolder = createAction(RECEIVE_MDB_FOLDER, (folder) =>({folder}));

export const newDataSet = createAction(NEW_DATASET, (dataSet) =>({dataSet}));
export const clearNewDataSet = createAction(CLEAR_NEW_DATASET);
export const approveDataSetRequest = createAction(APPROVE_DATASET_REQUEST, (id) => ({id}));
export const approveDataSet = createAction(APPROVE_DATASET, (id) => ({id}));

export const validateDataSet = createAction(VALIDATE_DATASET);
export const requestValidateDataSet = createAction(REQUEST_VALIDATE_DATASET);

export default reducer;
