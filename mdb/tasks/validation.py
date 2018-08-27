import json

from girder_worker.app import app
from girder_worker.utils import girder_job
from girder_worker_utils.transforms.girder_io import GirderClientResultTransform

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

        body = {
            'validation': validation
        }

        validation['r1'] = r1

        self.gc.patch(dataset_uri, data=json.dumps(body))

        self.dataset_id


    def cleanup(self):
        pass

@girder_job(title='R1 factor calculation')
@app.task
def r1(dataset):
    import time
    time.sleep(5)

    return 0.09906451799552095
