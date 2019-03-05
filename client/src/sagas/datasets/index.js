import { put, call, takeLatest } from 'redux-saga/effects'
import * as rest from '../../rest'
import {
  receiveDatasets,
  requestDatasetsByText,
  requestDatasetsByFields,
  requestDatasetById,
  requestToggleEditable,
  requestDatasetsByMe,
  receiveDataset,
  searchDatasetsByFields,
  searchDatasetsByText,
  searchDatasetsByMe,
  requestDatasetDelete,
  datasetDeleted,
  LOAD_DATASET_BY_ID,
  TOGGLE_EDITABLE,
  DELETE_DATASET
} from '../../redux/ducks/datasets.js'

export function* onSearchDatasetsByText(action) {
  try {
    yield put( requestDatasetsByText() )
    const searchResult = yield call(rest.searchByText, action.payload.terms)
    yield put( receiveDatasets(searchResult) )
  }
  catch(error) {
    yield put( requestDatasetsByText(error) )
  }
}

export function* watchSearchDatasetsByText() {
  yield takeLatest(searchDatasetsByText.toString(), onSearchDatasetsByText)
}

export function* onSearchDatasetsByMe(action) {
  try {
    const me = action.payload;
    yield put( requestDatasetsByMe() )
    const searchResult = yield call(rest.searchByFields, null, null, null, null, me);
    yield put( receiveDatasets(searchResult) )
  }
  catch(error) {
    yield put( requestDatasetsByText(error) )
  }
}

export function* watchSearchDatasetsByMe() {
  yield takeLatest(searchDatasetsByMe.toString(), onSearchDatasetsByMe)
}

export function* fetchDatasetById(action) {
  try {
    yield put( requestDatasetById(action.payload.id) )
    const dataset = yield call(rest.fetchDatasetById, action.payload.id)
    yield put( receiveDataset(dataset) )
  }
  catch(error) {
    yield put( requestDatasetById(error) )
  }
}

export function* watchLoadDatasetById() {
  yield takeLatest(LOAD_DATASET_BY_ID, fetchDatasetById)
}

export function* onSearchDatasetsByFields(action) {
  try {
    yield put( requestDatasetsByFields() )
    const {title, authors, atomicSpecies, mdbId} = action.payload;
    const searchResult = yield call(rest.searchByFields,
      title, authors, atomicSpecies, mdbId)
    yield put( receiveDatasets(searchResult) )
  }
  catch(error) {
    yield put( requestDatasetsByFields(error) )
  }
}

export function* watchSearchDatasetsByFields() {
  yield takeLatest(searchDatasetsByFields.toString(), onSearchDatasetsByFields)
}

function* toggleEditable(action) {
  try {
    const {id, editable} = action.payload;
    let dataSet = yield call(rest.updateDataSet, id, {editable});
    yield put( receiveDataset(dataSet) );
  } catch (error) {
    yield put( requestToggleEditable(error) )
  }
}

export function* watchToggleEditable() {
  yield takeLatest(TOGGLE_EDITABLE, toggleEditable);
}

export function* deleteDataset(action) {
  const {id, reject, resolve} = action.payload;

  try {
    yield put( requestDatasetDelete() )
    yield call(rest.deleteDataSet, id)
    yield put( datasetDeleted(id) )
    resolve()
  }
  catch(error) {
    yield put( requestDatasetDelete(error) )
    reject(error)
  }
}


export function* watchDeleteDataset() {
  yield takeLatest(DELETE_DATASET, deleteDataset);
}
