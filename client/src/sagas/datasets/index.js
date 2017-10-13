import { put, call, takeLatest} from 'redux-saga/effects'
import * as rest from '../../rest'
import {
  receiveDatasets,
  requestDatasetsByText,
  requestDatasetsByFields,
  requestDatasetById,
  receiveDataset,
  SEARCH_TOMOS_BY_TEXT,
  SEARCH_TOMOS_BY_FIELDS,
  LOAD_TOMO_BY_ID
} from '../../redux/ducks/datasets.js'

export function* searchDatasetsByText(action) {
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
  yield takeLatest(SEARCH_TOMOS_BY_TEXT, searchDatasetsByText)
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
  yield takeLatest(LOAD_TOMO_BY_ID, fetchDatasetById)
}

export function* searchDatasetsByFields(action) {
  try {
    yield put( requestDatasetsByFields() )
    const searchResult = yield call(rest.searchByFields,
        action.payload.title, action.payload.authors, action.payload.atomicSpecies)
    yield put( receiveDatasets(searchResult) )
  }
  catch(error) {
    yield put( requestDatasetsByFields(error) )
  }
}

export function* watchSearchDatasetsByFields() {
  yield takeLatest(SEARCH_TOMOS_BY_FIELDS, searchDatasetsByFields)
}
