import { call, put, take, select, takeEvery, all } from 'redux-saga/effects';
import { buffers, eventChannel, END } from 'redux-saga';
import { requestUpload, uploadProgress,
  receiveMdbFolder, UPLOAD, REQUEST_MDB_FOLDER,
  approveDataSetRequest, APPROVE_DATASET, VALIDATE_DATASET, requestValidateDataSet
} from '../../redux/ducks/upload';
import {requestCuratorGroup, receiveCuratorGroup, AUTHENTICATED} from '../../redux/ducks/girder';
import { uploadError } from '../../redux/ducks/upload';
import { loadStructures } from '../../redux/ducks/structures';
import { receiveDataset } from '../../redux/ducks/datasets';
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

function* upload(action) {
  const {
    // Dataset
    dataSetId,
    title,
    authors,
    doi,
    structureFile,
    reconstructionFile,
    imageFile,
    projectionFile,
    structureFileId,
    reconstructionFileId,
    imageFileId,
    projectionFileId,

    // Projection
    voltage,
    convergenceSemiAngle,
    probeSize,
    detectorInnerAngle,
    detectorOuterAngle,
    depthOfFocus,
    pixelSize,
    nProjections,
    tiltRange,
    electronDose,

    // Reconstruction
    resolution,
    cropHalfWidth,
    volumeSize,
    zDirection,
    bFactor,
    hFactor,
    axisConvention,

    resolve,
    reject
  } = action.payload;



  try {
    let mdbFolder = yield select(selectors.upload.getMdbFolder);
    if (_.isNil(mdbFolder)) {
      mdbFolder = yield call(fetchMdbFolder)
    }

    const filesToUpload = {};

    if (!_.isNil(structureFile)) {
      filesToUpload['structureFileModel'] = call(uploadFile, structureFile, mdbFolder['_id'], structureFileId);
    }

    if (!_.isNil(reconstructionFile)) {
      filesToUpload['reconstructionFileModel'] = call(uploadFile, reconstructionFile, mdbFolder['_id'], reconstructionFileId);
    }

    if (!_.isNil(projectionFile)) {
      filesToUpload['projectionFileModel'] = call(uploadFile, projectionFile, mdbFolder['_id'], projectionFileId);
    }

    if (!_.isNil(imageFile)) {
      filesToUpload['imageFileModel'] = call(uploadFile, imageFile, mdbFolder['_id'], imageFileId);
    }

    const {
      structureFileModel,
      reconstructionFileModel,
      imageFileModel,
      projectionFileModel
    } = yield all(filesToUpload);

    // Now create or update the data set
    let dataSet;
    if (_.isNil(dataSetId)) {
      dataSet = yield call(rest.createDataSet, title, authors, doi,
        imageFileModel ? imageFileModel['_id'] : null)
    } else {
      let imageFileId_ = imageFileModel ? imageFileModel['_id'] : imageFileId;
      dataSet = yield call(rest.updateDataSet, dataSetId, {title, authors, doi, imageFileId: imageFileId_});
    }

    // Create or update structureModel, projectionModel, reconstructionModel
    if (_.isNil(dataSetId)) {
      if (!_.isNil(structureFileModel)) {
        yield call(rest.createStructure, dataSet['_id'], structureFileModel['_id']);
      }

      if (!_.isNil(reconstructionFileModel)) {
        // Reconstruction
        let emdFileId = reconstructionFileModel['_id'];
        let reconstruction = {
          emdFileId,
          resolution,
          cropHalfWidth,
          volumeSize: JSON.parse(volumeSize),
          zDirection,
          bFactor: JSON.parse(bFactor),
          hFactor: JSON.parse(hFactor),
          axisConvention: JSON.parse(axisConvention)
        }

        yield call(rest.createReconstruction, dataSet['_id'], reconstruction);
      }

      if (!_.isNil(projectionFileModel)) {
        // Projection
        let emdFileId = projectionFileModel['_id'];
        let projection = {
          emdFileId,
          voltage,
          convergenceSemiAngle,
          probeSize,
          detectorInnerAngle,
          detectorOuterAngle,
          depthOfFocus,
          pixelSize,
          nProjections,
          tiltRange: JSON.parse(tiltRange),
          electronDose
        }

        yield call(rest.createProjection, dataSet['_id'], projection);
      }
    } else {
      let reconstruction = {
        resolution,
        cropHalfWidth,
        volumeSize: JSON.parse(volumeSize),
        zDirection,
        bFactor: JSON.parse(bFactor),
        hFactor: JSON.parse(hFactor),
        axisConvention: JSON.parse(axisConvention)
      }

      // Update emd file id if a new file has been uploaded
      if (!_.isNil(reconstructionFileModel)) {
        reconstruction.emdFileId = reconstructionFileModel['_id'];
      }

      let reconstructions = yield call(rest.fetchReconstructions, dataSetId);
      if (reconstructions.length > 0) {
        let reconstructionModel = reconstructions[0];
        yield call(rest.updateReconstruction, reconstructionModel['_id'], reconstruction);
      }

      let projection = {
        voltage,
        convergenceSemiAngle,
        probeSize,
        detectorInnerAngle,
        detectorOuterAngle,
        depthOfFocus,
        pixelSize,
        nProjections,
        tiltRange: JSON.parse(tiltRange),
        electronDose
      }

      // Update emd file id if a new file has been uploaded
      if (!_.isNil(projectionFileModel)) {
        projection.emdFileId = projectionFileModel['_id'];
      }

      let projections = yield call(rest.fetchProjections, dataSetId);
      if (projections.length > 0) {
        let projectionModel = projections[0];
        yield call(rest.updateProjection, projectionModel['_id'], projection);
      }

      // If the xyz has been change we need to ensure the other structure files
      // are regenerated.
      if (!_.isNil(structureFileModel)) {
        let structures = yield call(rest.fetchStructures, dataSetId);
        if (structures.length > 0) {
          const xyzFileId = structureFileModel['_id'];
          let structureUpdates = {
              xyzFileId
          }
          let structure = structures[0];
          yield call(rest.updateStructure, structure['_id'], structureUpdates);
        }
      }
    }

    yield put( receiveDataset(dataSet) );
    resolve(dataSet);

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

    if (curatorGroup.length === 0) {
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
    const {id} = action.payload;
    yield put( approveDataSetRequest(id) );

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

function* validateDataset(action) {
  try {
    const id = action.payload;
    const dataset = yield(rest.validateDataSet(id));
    yield put( receiveDataset(dataset) );
  } catch(error) {
    yield put(requestValidateDataSet(error));
  }
}

export function* watchValidateDataSet() {
  yield takeEvery(VALIDATE_DATASET, validateDataset);
}

