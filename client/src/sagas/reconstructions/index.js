import { put, call, takeLatest} from 'redux-saga/effects'

import * as rest from '../../rest'
import { receiveReconstructions,  requestReconstructions,
  LOAD_RECONSTRUCTIONS} from '../../redux/ducks/reconstructions.js'

export function* fetchReconstructions(action) {
  try {
    yield put( requestReconstructions() )
    const reconstructions = yield call(rest.fetchReconstructions, action.payload.id)
    yield put( receiveReconstructions(action.payload.id, reconstructions) )
  }
  catch(error) {
    yield put( requestReconstructions(error) )
  }
}

export function* watchLoadReconstructions() {
  yield takeLatest(LOAD_RECONSTRUCTIONS, fetchReconstructions)
}

