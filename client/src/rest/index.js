import axios, { CancelToken } from 'axios';
import { CANCEL } from 'redux-saga'
import _ from 'lodash'
import * as girder from './girder'


var _girderClient = axios.create({
  baseURL: `${window.location.origin}/api/v1`
});

export function get(url, config) {
  const source = CancelToken.source()
  const request = _girderClient.get(url, { cancelToken: source.token, ...config })
  request[CANCEL] = () => source.cancel()
  return request
}

export function post(url, data, config) {
  const source = CancelToken.source()
  const request = _girderClient.post(url, data, { ...config, cancelToken: source.token })
  request[CANCEL] = () => source.cancel()
  return request
}

export function put(url, data, config) {
  const source = CancelToken.source()
  const request = _girderClient.put(url, data, { ...config, cancelToken: source.token })
  request[CANCEL] = () => source.cancel()
  return request
}

export function patch(url, data, config) {
  const source = CancelToken.source()
  const request = _girderClient.patch(url, data, { ...config, cancelToken: source.token })
  request[CANCEL] = () => source.cancel()
  return request
}

export function girderClient() {
  return _girderClient;
}

export function updateToken(token) {
  const headers = {
    'Girder-Token': token
  }

  _girderClient = axios.create({
    headers,
    baseURL: `${window.location.origin}/api/v1`
  });
}


export function searchByText(terms) {
  terms = JSON.stringify(terms)
  return get('mdb/datasets/search', {
    params: {
      terms
    }
  })
  .then(response => response.data )
}

export function fetchDatasetById(id) {
  return get(`mdb/datasets/${id}`)
          .then(response => response.data )
}

export function fetchStructures(id) {
  return get(`mdb/datasets/${id}/structures`)
          .then(response => response.data )
}

export function fetchReconstructions(id) {
  return get(`mdb/datasets/${id}/reconstructions`)
          .then(response => response.data )
}

export function fetchProjections(id) {
  return get(`mdb/datasets/${id}/projections`)
          .then(response => response.data )
}

export function searchByFields(title, authors, atomicSpecies) {
  authors = _.isNil(authors) ? null : JSON.stringify(authors);
  atomicSpecies = _.isNil(atomicSpecies) ? null : JSON.stringify(atomicSpecies);

  return get('mdb/datasets', {
    params: {
      title,
      authors,
      atomicSpecies,
    }
  })
  .then(response => response.data )
}

export function createDataSet(title, authors, url, slug, imageFileId) {
  const dataset = {
      title,
      authors,
      url,
      slug,
      imageFileId
  }

  return post('mdb/datasets', dataset)
  .then(response => response.data)
}

export function createStructure(dataSetId, xyzFileId) {
  const structure = {
    xyzFileId,
  }

  return post(`mdb/datasets/${dataSetId}/structures`, structure)
  .then(response => response.data)
}

export function createReconstruction(dataSetId, reconstruction) {
  return post(`mdb/datasets/${dataSetId}/reconstructions`, reconstruction)
  .then(response => response.data)
}

export function createProjection(dataSetId, projection) {
  return post(`mdb/datasets/${dataSetId}/projections`, projection)
  .then(response => response.data)
}

export function updateDataSet(id, data) {
  return patch(`mdb/datasets/${id}`, data)
  .then(response => response.data)
}

export function updateReconstruction(id, data) {
  return patch(`mdb/datasets/_/reconstructions/${id}`, data)
  .then(response => response.data)
}

export function updateProjection(id, data) {
  return patch(`mdb/datasets/_/projections/${id}`, data)
  .then(response => response.data)
}

export function updateStructure(id, data) {
  return patch(`mdb/datasets/_/structures/${id}`, data)
  .then(response => response.data)
}


export {
  girder
}

