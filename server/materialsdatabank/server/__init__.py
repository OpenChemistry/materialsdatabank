from girder.api.rest import Prefix, getCurrentUser
from girder import events
from .rest import Dataset

from girder.models.upload import Upload
from girder.models.file import File
from girder.models.assetstore import Assetstore
from girder.plugins.materialsdatabank.models.reconstruction import Reconstruction
from girder.plugins.materialsdatabank.models.structure import Structure
from girder.plugins.materialsdatabank.models.projection import Projection

def get_currated_assetstore():
    for assetstore in Assetstore().list():
        if assetstore['name'] == 'Curated Filesystem Assetstore':
            return assetstore

    raise Exception('Unable to load curated assetstore.')

def move_to_curated_assetStore(event):
    info = event.info
    dataset = info['dataset']
    approver = info['approver']
    to_move = [dataset['imageFileId']]

    def _add(key, doc):
        if key in doc:
            to_move.append(doc[key])

    for s in Structure().find(dataset['_id']):
        for k in ['cjsonFileId', 'xyzFileId', 'cmlFileId']:
            _add(k, s)

    for r in Reconstruction().find(dataset['_id']):
        _add('emdFileId', r)

    for p in Projection().find(dataset['_id']):
        _add('emdFileId', r)

    assetstore = get_currated_assetstore()

    for file_id in to_move:
        file = File().load(file_id, force=True)
        Upload().moveFileToAssetstore(file, approver, assetstore)

def load(info):
    info['apiRoot'].mdb = Prefix()
    info['apiRoot'].mdb.datasets = Dataset()

    events.bind('mdb.dataset.approved', 'moveToCuratedAssetStore',
                move_to_curated_assetStore)
