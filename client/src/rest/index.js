import axios, { CancelToken } from 'axios';
import { CANCEL } from 'redux-saga'
import _ from 'lodash'

var girderClient = axios.create({
  baseURL: `${window.location.origin}/api/v1`
});

function get(url, params) {
  const source = CancelToken.source()
  const request = girderClient.get(url, { cancelToken: source.token, params })
  request[CANCEL] = () => source.cancel()
  return request
}

export function searchByText(terms) {
  terms = JSON.stringify(terms)
  return get('mdb/tomo/search', {
    terms
  })
  .then(response => response.data )
}

export function fetchTomoById(id) {
  return get(`mdb/tomo/${id}`)
          .then(response => response.data )
}

export function fetchStructures(id) {
  return get(`mdb/tomo/${id}/structures`)
          .then(response => response.data )
}

export function fetchReconstructions(id) {
  return get(`mdb/tomo/${id}/reconstructions`)
          .then(response => response.data )
}

export function searchByFields(title, authors, atomicSpecies) {
  authors = _.isNil(authors) ? null : JSON.stringify(authors);
  atomicSpecies = _.isNil(atomicSpecies) ? null : JSON.stringify(atomicSpecies);

  return get('mdb/tomo', {
    title,
    authors,
    atomicSpecies,
  })
  .then(response => response.data )
}


