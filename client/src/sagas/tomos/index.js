import { put, call, takeLatest} from 'redux-saga/effects'

import { search } from '../../rest'
import { receiveTomos,  requestTomos,
  SEARCH_TOMOS} from '../../redux/ducks/tomos.js'

export function* searchTomos(action) {
  try {
    yield put( requestTomos() )
    const searchResult = yield call(search, action.payload.terms)
    yield put( receiveTomos(searchResult) )
  }
  catch(error) {
    yield put( requestTomos(error) )
  }
}

export function* watchSearchTomos() {
  yield takeLatest(SEARCH_TOMOS, searchTomos)
}
