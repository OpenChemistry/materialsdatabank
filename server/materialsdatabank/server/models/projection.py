from .base import BaseAccessControlledModel
from girder.constants import AccessType
from girder.models.group import Group
from girder.models.item import Item
from girder.models.file import File
from bson.objectid import ObjectId


class Projection(BaseAccessControlledModel):
    def initialize(self):
        self.name = 'mdb.projections'
        self.ensureIndices(['datasetId'])

        self.types = {
            'voltage': float,
            'convergenceSemiAngle': float,
            'probeSize': float,
            'detectorInnerAngle': float,
            'detectorOuterAngle': float,
            'depthOfFocus': float,
            'pixelSize': float,
            'electronDose': float,
            'tiltRange': lambda v : self.validate_list(v, float),
            'nProjections': int
        }

    def create(self, dataset, emd_file_id, voltage=None, convergence_semi_angle=None,
               probe_size=None, detector_inner_angle=None, detector_outer_angle=None,
               depth_of_focus=None, pixel_size=None, tilt_range=None,
               electron_dose=None, number_projections=None, user=None, public=False):

        projection = {
            'datasetId': dataset['_id'],
            'emdFileId': emd_file_id,
            'voltage': voltage,
            'convergenceSemiAngle': convergence_semi_angle,
            'probeSize': probe_size,
            'detectorInnerAngle': detector_inner_angle,
            'detectorOuterAngle': detector_outer_angle,
            'depthOfFocus': depth_of_focus,
            'pixelSize': pixel_size,
            'tiltRange': tilt_range,
            'electronDose': electron_dose,
            'nProjections': number_projections
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

    def update(self, projection, projection_updates, user=None, public=None ):
        query = {
            '_id': projection['_id']
        }

        projection_updates = self.validate(projection_updates)

        updates = {}

        mutable_props = ['voltage', 'convergenceSemiAngle', 'probeSize',
                         'detectorInnerAngle', 'detectorOuterAngle',
                         'depthOfFocus', 'pixelSize', 'tiltRange',
                         'electronDose', 'nProjections']
        for prop in projection_updates:
            if prop in mutable_props:
                updates.setdefault('$set', {})[prop] = projection_updates[prop]

        if 'emdFileId' in projection_updates:
            updates.setdefault('$set', {})['emdFileId'] = ObjectId(projection_updates['emdFileId'])

        if public is not None:
            updates.setdefault('$set', {})['public'] = public

        if updates:
            file_id = projection['emdFileId']
            super(Projection, self).update(query, update=updates, multi=False)
            if 'emdFileId' in projection_updates and \
                projection_updates['emdFileId'] != file_id:
                f = File().load(file_id, force=True)
                if f is not None:
                    item =  Item().load(f['itemId'], force=True)
                    Item().remove(item)

            return self.load(projection['_id'], user=user, level=AccessType.READ)

        return projection

    def delete(self, projection, user):
        if 'emdFileId' in projection:
            emd_file = File().load(projection['emdFileId'], force=True)
            item =  Item().load(emd_file['itemId'], force=True)
            Item().remove(item)

        super(Projection, self).remove(projection)

