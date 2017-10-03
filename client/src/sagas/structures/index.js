import { put, call, takeLatest} from 'redux-saga/effects'

import * as rest from '../../rest'
import { receiveStructures,  requestStructures,
  LOAD_STRUCTURES} from '../../redux/ducks/structures.js'

export function* fetchStructures(action) {
  try {
    yield put( requestStructures() )
    const searchResult = yield call(rest.fetchStructures, action.payload.id)
    yield put( receiveStructures(action.payload.id, searchResult) )
  }
  catch(error) {
    yield put( requestStructures(error) )
  }
}

export function* watchLoadStructures() {
  yield takeLatest(LOAD_STRUCTURES, fetchStructures)
}

