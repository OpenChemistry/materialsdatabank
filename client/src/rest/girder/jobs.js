import { get } from '../';

export function fetchJob(id) {
  return get(`job/${id}`)
          .then(response => response.data )
}
