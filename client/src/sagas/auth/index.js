import { put, call, takeEvery} from 'redux-saga/effects'
import Cookies from 'universal-cookie'
import _ from 'lodash'

import { oauth, user, token } from '../../rest/girder'
import * as rest from '../../rest'
import { requestOauthProviders, receiveOauthProviders, setAuthenticating,
  newToken, setMe, loadOauthProviders, requestTokenInvalidation, requestMe,
  receiveMe, authenticated, AUTHENTICATE, INVALIDATE_TOKEN, LOAD_ME,
  LOAD_OAUTH_PROVIDERS, NEW_TOKEN} from '../../redux/ducks/girder.js'

export function* fetchOauthProviders(action) {
  try {
    yield put( requestOauthProviders() )
    const providers = yield call(oauth.fetchProviders, action.payload)
    yield put( receiveOauthProviders(providers) )
  }
  catch(error) {
    yield put(  requestOauthProviders(error) )
  }
}

export function* watchFetchOauthProviders() {
  yield takeEvery(LOAD_OAUTH_PROVIDERS, fetchOauthProviders)
}

export function updateToken(action) {
  const girderToken = action.payload.token;
  if (girderToken !== null) {

    rest.updateToken(girderToken)
  }

  const cookies = new Cookies();
  cookies.set('girderToken', girderToken, {
    path: '/'
  });
}

export function* watchNewToken() {
  yield takeEvery(NEW_TOKEN, updateToken)
}

export function* authenticate(action) {
  const payload = action.payload;
  const token = payload.token;
  const redirect = payload.redirect;

  yield put(setAuthenticating(true));
  let me = null;
  let auth = false;
  if (!_.isNil(token)) {
    me = yield call(user.fetchMe, token);
    if (me != null) {
      yield put(newToken(token));
      yield put(setMe(me))
      yield put(setAuthenticating(false))
      yield put(authenticated())
      auth = true;
    }
  }

  if (!auth) {
    if (redirect) {
      const redirect = window.location.href;
      yield put(loadOauthProviders(redirect));
    }
    else {
      yield put(setAuthenticating(false));
    }
  }

}

export function* watchAuthenticate() {
  yield takeEvery(AUTHENTICATE, authenticate)
}

export function* invalidateToken(action) {
  try {
    yield put( requestTokenInvalidation() )
    yield call(token.invalidate)
    yield put( newToken(null) )
    yield put( setMe(null) )
  }
  catch(error) {
    yield put( requestTokenInvalidation(error) )
  }
}

export function* watchInvalidateToken() {
  yield takeEvery(INVALIDATE_TOKEN, invalidateToken)
}

export function* fetchMe(action) {
  try {
    yield put( requestMe() )
    const me = yield call(user.fetchMe)
    yield put( receiveMe(me) )
  }
  catch(error) {
    yield put( requestMe(error) )
  }
}

export function* watchFetchMe() {
  yield takeEvery(LOAD_ME, fetchMe)
}

