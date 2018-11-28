import _ from 'lodash'
export const getMdbFolder = state => state.upload.mdbFolder;
export const getDeposit = state => state.form.deposit;
export const getUploadByFile = (state, file) => {
  const fileToId = state.upload.fileToId;
  const byId = state.upload.byId;
  if (_.has(fileToId, file.fieldId)) {
    const id = fileToId[file.fieldId];
    if (_.has(byId, id)) {
      return byId[id];
    }
  }

  return null;
}
export const getNewDataSet = state => state.upload.newDataSet;
export const getError = state => state.upload.error;
