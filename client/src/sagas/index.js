import { fork } from 'redux-saga/effects'

import {
  watchSearchTomos,
  watchLoadTomoById
} from './tomos'

import {
  watchLoadStructures
} from './structures'

import {
  watchLoadReconstructions
} from './reconstructions'

export default function* root() {
  yield fork(watchSearchTomos)
  yield fork(watchLoadTomoById)
  yield fork(watchLoadStructures)
  yield fork(watchLoadReconstructions)
}
