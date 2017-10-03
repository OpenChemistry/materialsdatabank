import { fork } from 'redux-saga/effects'

import {
  watchSearchTomos,
  watchLoadTomoById
} from './tomos'

import {
  watchLoadStructures
} from './structures'

export default function* root() {
  yield fork(watchSearchTomos)
  yield fork(watchLoadTomoById)
  yield fork(watchLoadStructures)
}
