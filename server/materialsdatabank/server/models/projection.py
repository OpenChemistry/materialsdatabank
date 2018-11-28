from .base import BaseAccessControlledModel
from girder.constants import AccessType
from girder.models.group import Group

class Projection(BaseAccessControlledModel):

    def initialize(self):
        self.name = 'mdb.projections'
        self.ensureIndices(['datasetId'])

    def validate(self, projection):
        return projection

    def create(self, dataset, emd_file_id, voltage=None, convergence_semi_angle=None,
               probe_size=None, detector_inner_angle=None, detector_outer_angle=None,
               depth_of_focus=None, pixel_size=None, tilt_range=None,
               electron_dose=None, user=None, public=False):

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
            'electronDose': electron_dose
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
        updates = {}

        mutable_props = ['voltage', 'convergenceSemiAngle', 'probeSize',
                         'detectorInnerAngle', 'detectorOuterAngle',
                         'depthOfFocus', 'pixelSize', 'tiltRange',
                         'electronDose']
        for prop in projection_updates:
            if prop in mutable_props:
                updates.setdefault('$set', {})[prop] = projection_updates[prop]

        if public is not None:
            updates.setdefault('$set', {})['public'] = public

        if updates:
            super(Projection, self).update(query, update=updates, multi=False)
            return self.load(projection['_id'], user=user, level=AccessType.READ)

        return projection
