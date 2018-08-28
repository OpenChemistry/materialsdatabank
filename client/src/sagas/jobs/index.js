import { put, call, takeEvery} from 'redux-saga/effects'
import * as rest from '../../rest'
import {
  requestJob,
  receiveJob,
  LOAD_JOB
} from '../../redux/ducks/jobs.js'

export function* fetchJob(action) {
  try {
    const id = action.payload;
    yield put( requestJob(id) );
    const job = yield call(rest.girder.jobs.fetchJob, id);
    yield put( receiveJob(job) );
  }
  catch(error) {
    yield put( requestJob(error) )
  }
}

export function* watchLoadJob() {
  yield takeEvery(LOAD_JOB, fetchJob)
}
