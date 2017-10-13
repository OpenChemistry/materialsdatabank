from .base import BaseAccessControlledModel
from girder.constants import AccessType

class Reconstruction(BaseAccessControlledModel):

    def initialize(self):
        self.name = 'reconstructions'
        self.ensureIndices(['datasetId'])

    def validate(self, reconstruction):
        return reconstruction

    def create(self, dataset, emd_file_id, tiff_file_id, user=None, public=True):
        reconstruction = {
            'datasetId': dataset['_id'],
            'emdFileId': emd_file_id,
            'tiffFileId': tiff_file_id
        }

        self.setPublic(reconstruction, public)

        if user:
            reconstruction['userId'] = user['_id']
            self.setUserAccess(reconstruction, user=user, level=AccessType.ADMIN)
        else:
            reconstruction['userId'] = None

        return self.save(reconstruction)
