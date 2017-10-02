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

