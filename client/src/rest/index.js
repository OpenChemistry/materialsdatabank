import axios, { CancelToken } from 'axios';
import { CANCEL } from 'redux-saga'
import _ from 'lodash'


var _girderClient = axios.create({
  baseURL: `${window.location.origin}/api/v1`
});



export function get(url, config) {
  const source = CancelToken.source()
  const request = _girderClient.get(url, { cancelToken: source.token, ...config })
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


