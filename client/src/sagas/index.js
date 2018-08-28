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

import {
  watchLoadProjections
} from './projections'

import {
  watchFetchOauthProviders,
  watchInvalidateToken,
  watchNewToken,
  watchAuthenticate,
  watchFetchMe
} from './auth'

import {
  watchUpload,
  watchRequestMdbFolder,
  watchLoadCuratorGroup,
  watchApproveDataSet,
  watchValidateDataSet
} from './upload'

import {
  watchLoadJob
} from './jobs'

export default function* root() {
  yield fork(watchSearchDatasetsByText)
  yield fork(watchSearchDatasetsByFields)
  yield fork(watchLoadDatasetById)
  yield fork(watchLoadStructures)
  yield fork(watchLoadReconstructions)
  yield fork(watchLoadProjections)
  yield fork(watchFetchOauthProviders)
  yield fork(watchInvalidateToken)
  yield fork(watchNewToken)
  yield fork(watchAuthenticate)
  yield fork(watchFetchMe)
  yield fork(watchUpload)
  yield fork(watchRequestMdbFolder)
  yield fork(watchLoadCuratorGroup)
  yield fork(watchApproveDataSet)
  yield fork(watchLoadJob)
  yield fork(watchValidateDataSet)
}
