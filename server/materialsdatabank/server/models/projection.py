from .base import BaseAccessControlledModel
from girder.constants import AccessType
from girder.models.group import Group

class Projection(BaseAccessControlledModel):

    def initialize(self):
        self.name = 'mdb.projections'
        self.ensureIndices(['datasetId'])

    def validate(self, projection):
        return projection

    def create(self, dataset, emd_file_id, tiff_file_id, user=None, public=False):
        projection = {
            'datasetId': dataset['_id'],
            'emdFileId': emd_file_id,
            'tiffFileId': tiff_file_id
        }

        self.setPublic(projection, public)
        curator = list(Group().find({
            'name': 'curator',
        }))
        if len(curator) > 0:
            self.setGroupAccess(projection, group=curator[0], level=AccessType.ADMIN)

        self.setPublic(projection, public)

        if user:
            projection['userId'] = user['_id']
            self.setUserAccess(projection, user=user, level=AccessType.ADMIN)
        else:
            projection['userId'] = None

        return self.save(projection)

    def update(self, projection, user=None, public=None):
        query = {
            '_id': projection['_id']
        }
        updates = {}

        if public is not None:
            updates.setdefault('$set', {})['public'] = public

        if updates:
            super(Projection, self).update(query, update=updates, multi=False)
            return self.load(projection['_id'], user=user, level=AccessType.READ)

        return projection
