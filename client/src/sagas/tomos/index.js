import { put, call, takeLatest} from 'redux-saga/effects'

import * as rest from '../../rest'
import { receiveTomos,  requestTomos, requestTomoById, receiveTomo,
  SEARCH_TOMOS, LOAD_TOMO_BY_ID} from '../../redux/ducks/tomos.js'

export function* searchTomos(action) {
  try {
    yield put( requestTomos() )
    const searchResult = yield call(rest.search, action.payload.terms)
    yield put( receiveTomos(searchResult) )
  }
  catch(error) {
    yield put( requestTomos(error) )
  }
}

export function* watchSearchTomos() {
  yield takeLatest(SEARCH_TOMOS, searchTomos)
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
