import { call, put, take, select, takeEvery, all } from 'redux-saga/effects';
import { buffers, eventChannel, END } from 'redux-saga';
import { requestUpload, uploadProgress, uploadComplete, requestMdbFolder,
  receiveMdbFolder, newDataSet, UPLOAD, REQUEST_MDB_FOLDER,
  approveDataSetRequest, APPROVE_DATASET} from '../../redux/ducks/upload';
import {requestCuratorGroup, receiveCuratorGroup, AUTHENTICATED} from '../../redux/ducks/girder';
import { uploadError } from '../../redux/ducks/upload';
import { loadStructures } from '../../redux/ducks/structures';
import _ from 'lodash';

import { girder } from '../../rest'
import * as rest from '../../rest'
import selectors from '../../redux/selectors'

const chunkSize = 1024 * 1024 * 64; // 64MB

export function* fetchMdbFolder() {

  const me = yield select(selectors.girder.getMe);
  let privateFolder = yield call(girder.folder.fetch, me['_id'], 'user', 'Private');
  if (_.isEmpty(privateFolder)) {
    throw new Error('User doesn\'t have a Private folder.');
  }
  else {
    privateFolder = privateFolder[0];
  }

  const mdbFolder = yield call(girder.folder.create,
      privateFolder['_id'], 'folder', 'mdb');

  yield put( receiveMdbFolder(mdbFolder))

  return mdbFolder
}
export function* uploadFile(file, folderId, id=null) {
  let uploadModel = null;
  if (_.isNil(id)) {
    uploadModel = yield call(girder.file.create, folderId, 'folder',
        file.name, file.size);
  }
  else {
    uploadModel = yield call(girder.file.update, id, file.size);
  }

  yield put( requestUpload(uploadModel['_id'], file));
  const fileModel = yield call(uploadFileContent, uploadModel['_id'], file);
  //yield put( uploadComplete(uploadModel['_id']) );

  return fileModel;
}

export function* upload(action) {
  const {
    title,
    authors,
    slug,
    url,
    structureFile,
    reconstructionFile,
    imageFile,
    projectionFile,
    structureFileId,
    reconstructionFileId,
    imageFileId,
    projectionFileId,
    resolve,
    reject
  } = action.payload;

  try {
    let mdbFolder = yield select(selectors.upload.getMdbFolder);
    if (_.isNil(mdbFolder)) {
      mdbFolder = yield call(fetchMdbFolder)
    }

    const filesToUpload = {
        structureFileModel: call(uploadFile, structureFile, mdbFolder['_id'])
    }

    if (!_.isNil(reconstructionFile)) {
      filesToUpload['reconstructionFileModel'] = call(uploadFile, reconstructionFile, mdbFolder['_id'])
    }

    if (!_.isNil(projectionFile)) {
      filesToUpload['projectionFileModel'] = call(uploadFile, projectionFile, mdbFolder['_id'])
    }

    if (!_.isNil(imageFile)) {
      filesToUpload['imageFileModel'] = call(uploadFile, imageFile, mdbFolder['_id'])
    }

    const {
      structureFileModel,
      reconstructionFileModel,
      imageFileModel,
      projectionFileModel
    } = yield all(filesToUpload)

    // Now create the data set
    const dataSet = yield call(rest.createDataSet, title, authors, url, slug,
        imageFileModel ? imageFileModel['_id'] : null)

    // Structure
    yield call(rest.createStructure, dataSet['_id'], structureFileModel['_id']);

    if (!_.isNil(reconstructionFileModel)) {
      // Reconstruction
      let emdFileId = null;
      let tiffFileId = null;

      if (reconstructionFile.name.toLowerCase().endsWith('.tiff')) {
        tiffFileId = reconstructionFileModel['_id'];
      } else if (reconstructionFile.name.toLowerCase().endsWith('.emd')) {
        emdFileId = reconstructionFileModel['_id'];
      }

      yield call(rest.createReconstruction, dataSet['_id'], emdFileId, tiffFileId);
    }

    if (!_.isNil(projectionFileModel)) {
      // Projection
      let emdFileId = null;
      let tiffFileId = null;

      if (projectionFile.name.toLowerCase().endsWith('.tiff')) {
        tiffFileId = projectionFileModel['_id'];
      } else if (projectionFile.name.toLowerCase().endsWith('.emd')) {
        emdFileId = projectionFileModel['_id'];
      }

      yield call(rest.createProjection, dataSet['_id'], emdFileId, tiffFileId);
    }

    yield put(newDataSet(dataSet))
    resolve()

  }
  catch(error) {
    yield put( uploadError(error) )
    reject(error)
  }
}

export function* watchUpload() {
  yield takeEvery(UPLOAD, upload)
}

export function* watchRequestMdbFolder() {
  yield takeEvery(REQUEST_MDB_FOLDER, fetchMdbFolder);
}

function createUploadFileChunkChannel(id, offset, data) {
  return eventChannel(emitter => {

    const config = {
      onUploadProgress: (progressEvent) => {
        emitter({progressEvent});
      }
    }
    girder.file.chunk(id, offset, data, config)
      .then(function (res) {
        const file = res;
        emitter({ complete: file });
        emitter(END);
      })
      .catch(function (error) {
        emitter({ error });
        emitter(END);
      });
    return () => {};
  }, buffers.sliding(2));
}


function* uploadFileContent(uploadId, file) {
  let offset = 0;
  const sliceFn = file.webkitSlice ? 'webkitSlice' : 'slice';
  // The file model is return when the last chunk is uploaded
  let fileModel = null;

  while (offset < file.size) {
    const end = Math.min(offset + chunkSize, file.size);
    const chunk = file[sliceFn](offset, end);

    const channel = yield call(createUploadFileChunkChannel, uploadId, offset, chunk);
    while (true) {
      const { progressEvent, complete, error } = yield take(channel);
      if (error) { // TODO file id?
        console.log(error);
        yield put(requestUpload(uploadId, error));
        return;
      }
      else if (complete) {
        fileModel = complete;
        break;
      }
      else if (progressEvent) {
        yield put(uploadProgress(uploadId, offset, progressEvent));
      }
    }
    offset += chunkSize;
  }

  return fileModel;
}

function* loadCuratorGroup() {
  try {
    yield put(requestCuratorGroup());
    let curatorGroup = yield call(girder.group.get, 'curator');

    if (curatorGroup.length == 0) {
      curatorGroup = null;
    }
    else {
      curatorGroup = curatorGroup[0];
    }

    yield put(receiveCuratorGroup(curatorGroup))
  }
  catch(error) {
    yield put( requestCuratorGroup(error) )
  }
}

export  function* watchLoadCuratorGroup() {
  yield takeEvery(AUTHENTICATED, loadCuratorGroup)
}


function* approveDataSet(action) {
  try {
    yield put( approveDataSetRequest(id) );
    const {id} = action.payload;

    const {
      structures,
      reconstructions,
      projections
    } = yield all({
      structures: call(rest.fetchStructures, id),
      reconstructions: call(rest.fetchReconstructions, id),
      projections: call(rest.fetchProjections, id)
    });

    for (let structure of structures) {
      yield call(rest.updateStructure, structure['_id'], {
        public: true
      });
    }

    for (let reconstruction of reconstructions) {
      yield call(rest.updateReconstruction, reconstruction['_id'], {
        public: true
      });
    }

    for (let projection of projections) {
      yield call(rest.updateProjection, projection['_id'], {
        public: true
      });
    }

    yield call(rest.updateDataSet, id, {
      public: true
    })

    // Reload the structure
    yield put(loadStructures(id));
  }
  catch(error) {
    yield put( approveDataSetRequest(error) )
  }
}

export  function* watchApproveDataSet() {
  yield takeEvery(APPROVE_DATASET, approveDataSet)
}

