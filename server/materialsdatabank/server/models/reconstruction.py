from .base import BaseAccessControlledModel
from girder.constants import AccessType
from girder.models.group import Group
from girder.models.item import Item
from girder.models.file import File
from bson.objectid import ObjectId

class Reconstruction(BaseAccessControlledModel):

    def initialize(self):
        self.name = 'mdb.reconstructions'
        self.ensureIndices(['datasetId'])

        self.types = {
            'resolution': float,
            'cropHalfWidth': int,
            'zDirection': int,
            'volumeSize': lambda v : self.validate_list(v, int),
            'bFactor': lambda v : self.validate_list(v, float),
            'hFactor': lambda v : self.validate_list(v, float),
        }

    def create(self, dataset, emd_file_id, resolution, crop_half_width,
                volume_size, z_direction, b_factor, h_factor,
                axis_convention, user=None, public=False):
        reconstruction = {
            'datasetId': dataset['_id'],
            'emdFileId': emd_file_id,
            'resolution': resolution,
            'cropHalfWidth': crop_half_width,
            'volumeSize': volume_size,
            'zDirection': z_direction,
            'bFactor': b_factor,
            'hFactor': h_factor,
            'axisConvention': axis_convention
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

    def update(self, reconstruction, reconstruction_updates, user=None, public=None):
        query = {
            '_id': reconstruction['_id']
        }

        reconstruction_updates = self.validate(reconstruction_updates)

        updates = {}

        mutable_props = ['resolution', 'cropHalfWidth', 'bFactor', 'hFactor',
                         'zDirection', 'volumeSize', 'axisConvention']
        for prop in reconstruction_updates:
            if prop in mutable_props:
                updates.setdefault('$set', {})[prop] = reconstruction_updates[prop]

        if 'emdFileId' in reconstruction_updates:
            updates.setdefault('$set', {})['emdFileId'] = ObjectId(reconstruction_updates['emdFileId'])

        if public is not None:
            updates.setdefault('$set', {})['public'] = public

        if updates:
            file_id = reconstruction['emdFileId']
            super(Reconstruction, self).update(query, update=updates, multi=False)
            if 'emdFileId' in reconstruction_updates and \
                reconstruction_updates['emdFileId'] != reconstruction['emdFileId']:
                f = File().load(file_id, force=True)
                if f is not None:
                    item =  Item().load(f['itemId'], force=True)
                    Item().remove(item)
            return self.load(reconstruction['_id'], user=user, level=AccessType.READ)

        return reconstruction

    def delete(self, reconstruction, user):
        if 'emdFileId' in reconstruction:
            emd_file = File().load(reconstruction['emdFileId'], force=True)
            item =  Item().load(emd_file['itemId'], force=True)
            Item().remove(item)

        super(Reconstruction, self).remove(reconstruction)
