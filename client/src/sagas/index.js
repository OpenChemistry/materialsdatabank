import { fork } from 'redux-saga/effects'

import { watchSearchTomos } from './tomos'

export default function* root() {
  yield fork(watchSearchTomos)
}
