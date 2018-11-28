import _ from 'lodash'


export const getStructuresById = state => state.structures.byDatasetId;

export const getStructureById = (state, id) => {
  let dataSetId = null;
  if (_.has(state.datasets.byId, id)) {
    dataSetId = id;
  }
  else if (_.has(state.datasets.mdbIdToId, id)) {
    dataSetId = state.datasets.mdbIdToId[id];
  }

  if (_.has(state.structures.byDatasetId, dataSetId)) {
    // For now we only have a single structure, so just pick the first.
    return state.structures.byDatasetId[dataSetId][0];
  }

  return null;
}
