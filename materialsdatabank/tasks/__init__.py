import json

from girder_worker.app import app
from girder_worker.utils import girder_job
from girder_worker_utils.transforms.girder_io import GirderClientResultTransform

from materialsdatabank.utility import proj_to_numpy, xyz_to_numpy
from materialsdatabank.r1 import calculate_r1_factor

class R1FactorResultTransform(GirderClientResultTransform):
    def __init__(self, dataset_id, **kwargs):
        super(R1FactorResultTransform, self).__init__(**kwargs)
        self.dataset_id = dataset_id

    def _repr_model_(self):
        return "{}('{}')".format(self.__class__.__name__, self.item_id)

    def transform(self, r1):

        dataset_uri = 'mdb/datasets/%s' % self.dataset_id
        dataset = self.gc.get(dataset_uri)
        validation = dataset.get('validation', {})
        validation['r1'] = r1

        body = {
            'validation': validation
        }

        self.gc.patch(dataset_uri, data=json.dumps(body))

    def cleanup(self):
        pass

@girder_job(title='R1 factor calculation')
@app.task
def r1(reconstruction, proj_file, struc_file):
    (proj, angles) = proj_to_numpy(proj_file)
    with open(struc_file) as f:
        (positions, atomic_spec, atomic_numbers) = xyz_to_numpy(f)

    resolution = reconstruction['resolution']
    crop_half_width = reconstruction['cropHalfWidth']
    volume_size = reconstruction['volumeSize']
    z_direction = reconstruction['zDirection']
    b_factor = reconstruction['bFactor']
    h_factor = reconstruction['hFactor']
    axis_convention = reconstruction['axisConvention']

    r1 = calculate_r1_factor(proj, angles, positions, atomic_spec, atomic_numbers,
                                resolution, crop_half_width, volume_size,
                                z_direction, b_factor, h_factor, axis_convention)

    return r1
