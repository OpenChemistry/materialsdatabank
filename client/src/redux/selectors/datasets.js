import _ from 'lodash'
// Pure state selection
export const getSearchResults = state => state.datasets.search.results;

export const getSearchError = state => state.datasets.search.error;

export const getDatasetsById = state => state.datasets.byId;

export const getDatasetById = (state, id) => {

  if (_.has(state.datasets.byId, id)) {
    return state.datasets.byId[id]
  }
  else if (_.has(state.datasets.slugToId, id)) {
    return getDatasetById(state, state.datasets.slugToId[id])
  }

  return null;
}
