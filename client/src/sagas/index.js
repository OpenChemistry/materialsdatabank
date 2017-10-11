import { fork } from 'redux-saga/effects'

import {
  watchSearchTomosByText,
  watchLoadTomoById,
  watchSearchTomosByFields
} from './tomos'

import {
  watchLoadStructures
} from './structures'

import {
  watchLoadReconstructions
} from './reconstructions'

export default function* root() {
  yield fork(watchSearchTomosByText)
  yield fork(watchSearchTomosByFields)
  yield fork(watchLoadTomoById)
  yield fork(watchLoadStructures)
  yield fork(watchLoadReconstructions)
}
