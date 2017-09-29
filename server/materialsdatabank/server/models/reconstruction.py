from .base import BaseAccessControlledModel
from girder.constants import AccessType

class Reconstruction(BaseAccessControlledModel):

    def initialize(self):
        self.name = 'reconstructions'
        self.ensureIndices(['tomoId'])

    def validate(self, reconstruction):
        return reconstruction

    def create(self, tomo, file_id, user=None, public=True):
        reconstruction = {
            'tomoId': tomo['_id'],
            'fileId': file_id
        }

        self.setPublic(reconstruction, public)

        if user:
            reconstruction['userId'] = user['_id']
            self.setUserAccess(reconstruction, user=user, level=AccessType.ADMIN)
        else:
            reconstruction['userId'] = None

        return self.save(reconstruction)
