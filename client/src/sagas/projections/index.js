import { put, call, takeLatest} from 'redux-saga/effects'

import * as rest from '../../rest'
import { receiveProjections,  requestProjections,
  LOAD_PROJECTIONS} from '../../redux/ducks/projections'

export function* fetchProjections(action) {
  try {
    yield put( requestProjections() )
    const projections = yield call(rest.fetchProjections, action.payload.id)
    yield put( receiveProjections(action.payload.id, projections) )
  }
  catch(error) {
    yield put( requestProjections(error) )
  }
}

export function* watchLoadProjections() {
  yield takeLatest(LOAD_PROJECTIONS, fetchProjections)
}

