from .base import BaseAccessControlledModel
from girder.constants import AccessType

class Projection(BaseAccessControlledModel):

    def initialize(self):
        self.name = 'mdb.projections'
        self.ensureIndices(['datasetId'])

    def validate(self, projection):
        return projection

    def create(self, dataset,  user=None, public=True):
        projection = {
            'datasetId': dataset['_id']
        }

        self.setPublic(projection, public=public)

        if user:
            projection['userId'] = user['_id']
            self.setUserAccess(projection, user=user, level=AccessType.ADMIN)
        else:
            projection['userId'] = None

        return self.save(projection)

