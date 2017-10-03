import axios, { CancelToken } from 'axios';
import { CANCEL } from 'redux-saga'

var girderClient = axios.create({
  baseURL: `${window.location.origin}/api/v1`
});

function get(url, params) {
  const source = CancelToken.source()
  const request = girderClient.get(url, { cancelToken: source.token, params })
  request[CANCEL] = () => source.cancel()
  return request
}

export function search(terms) {
  terms = JSON.stringify(terms)
  return get('tomo/search', {
    terms
  })
          .then(response => response.data )
}

export function fetchTomoById(id) {
  return get(`tomo/${id}`)
          .then(response => response.data )
}

export function fetchStructures(id) {
  return get(`tomo/${id}/structures`)
          .then(response => response.data )
}

export function fetchReconstructions(id) {
  return get(`tomo/${id}/reconstructions`)
          .then(response => response.data )
}


