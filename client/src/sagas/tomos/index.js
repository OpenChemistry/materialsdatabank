import { put, call, takeLatest} from 'redux-saga/effects'
import * as rest from '../../rest'
import {
  receiveTomos,
  requestTomosByText,
  requestTomosByFields,
  requestTomoById,
  receiveTomo,
  SEARCH_TOMOS_BY_TEXT,
  SEARCH_TOMOS_BY_FIELDS,
  LOAD_TOMO_BY_ID
} from '../../redux/ducks/tomos.js'

export function* searchTomosByText(action) {
  try {
    yield put( requestTomosByText() )
    const searchResult = yield call(rest.searchByText, action.payload.terms)
    yield put( receiveTomos(searchResult) )
  }
  catch(error) {
    yield put( requestTomosByText(error) )
  }
}

export function* watchSearchTomosByText() {
  yield takeLatest(SEARCH_TOMOS_BY_TEXT, searchTomosByText)
}


export function* fetchTomoById(action) {
  try {
    yield put( requestTomoById(action.payload.id) )
    const tomo = yield call(rest.fetchTomoById, action.payload.id)
    yield put( receiveTomo(tomo) )
  }
  catch(error) {
    yield put( requestTomoById(error) )
  }
}

export function* watchLoadTomoById() {
  yield takeLatest(LOAD_TOMO_BY_ID, fetchTomoById)
}

export function* searchTomosByFields(action) {
  try {
    yield put( requestTomosByFields() )
    const searchResult = yield call(rest.searchByFields,
        action.payload.title, action.payload.authors, action.payload.atomicSpecies)
    yield put( receiveTomos(searchResult) )
  }
  catch(error) {
    yield put( requestTomosByFields(error) )
  }
}

export function* watchSearchTomosByFields() {
  yield takeLatest(SEARCH_TOMOS_BY_FIELDS, searchTomosByFields)
}
