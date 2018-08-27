from .base import BaseAccessControlledModel
from girder.constants import AccessType
from girder.models.group import Group

class Reconstruction(BaseAccessControlledModel):

    def initialize(self):
        self.name = 'mdb.reconstructions'
        self.ensureIndices(['datasetId'])

    def validate(self, reconstruction):
        return reconstruction

    def create(self, dataset, emd_file_id, resolution, crop_half_width,
                volume_size, z_direction, b_factor, h_factor,
                axis_convention, user=None, public=False):
        reconstruction = {
            'datasetId': dataset['_id'],
            'emdFileId': emd_file_id,
            'resolution': resolution,
            'crop_half_width': crop_half_width,
            'volume_size': volume_size,
            'z_direction': z_direction,
            'b_factor': b_factor,
            'h_factor': h_factor,
            'axis_convention': axis_convention
        }
        
        self.setPublic(reconstruction, public)
        curator = list(Group().find({
            'name': 'curator',
        }))
        if len(curator) > 0:
            self.setGroupAccess(reconstruction, group=curator[0], level=AccessType.ADMIN)

        if user:
            reconstruction['userId'] = user['_id']
            self.setUserAccess(reconstruction, user=user, level=AccessType.ADMIN)
        else:
            reconstruction['userId'] = None

        return self.save(reconstruction)

    def update(self, reconstruction, user=None, public=None):
        query = {
            '_id': reconstruction['_id']
        }
        updates = {}

        if public is not None:
            updates.setdefault('$set', {})['public'] = public

        if updates:
            super(Reconstruction, self).update(query, update=updates, multi=False)
            return self.load(reconstruction['_id'], user=user, level=AccessType.READ)

        return reconstruction
