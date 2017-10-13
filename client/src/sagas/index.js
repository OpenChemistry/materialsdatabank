import { fork } from 'redux-saga/effects'

import {
  watchSearchDatasetsByText,
  watchLoadDatasetById,
  watchSearchDatasetsByFields
} from './datasets'

import {
  watchLoadStructures
} from './structures'

import {
  watchLoadReconstructions
} from './reconstructions'

export default function* root() {
  yield fork(watchSearchDatasetsByText)
  yield fork(watchSearchDatasetsByFields)
  yield fork(watchLoadDatasetById)
  yield fork(watchLoadStructures)
  yield fork(watchLoadReconstructions)
}
