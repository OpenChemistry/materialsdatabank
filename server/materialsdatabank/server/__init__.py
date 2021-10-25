from girder.api.rest import Prefix, getCurrentUser
from girder import events
from girder.utility import mail_utils
from girder.utility import setting_utilities
from .rest import Dataset

from girder.models.upload import Upload
from girder.models.file import File
from girder.models.assetstore import Assetstore
from girder.models.setting import Setting
from girder.models.user import User
from girder.plugins.materialsdatabank.models.reconstruction import Reconstruction
from girder.plugins.materialsdatabank.models.structure import Structure
from girder.plugins.materialsdatabank.models.projection import Projection
from girder.plugins.materialsdatabank import constants


@setting_utilities.validator({
    constants.NOTIFICATION_EMAIL
})
def validateSettings(event):
    pass

def get_currated_assetstore():
    for assetstore in Assetstore().list():
        if assetstore['name'] == 'Curated Filesystem Assetstore':
            return assetstore

    raise Exception('Unable to load curated assetstore.')

def move_to_curated_assetstore(event):
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

def send_created(event):
    dataset = event.info['dataset']
    print(dataset)
    user = event.info['user']

    html = mail_utils.renderTemplate('mdb.dataset_created.mako', {
        'dataset': dataset,
        'user': user
    })

    email_address = Setting().get(constants.NOTIFICATION_EMAIL)

    mail_utils.sendMail('Materials Data Bank: Dataset submitted.', html, [email_address])

def send_approved(event):
    dataset = event.info['dataset']
    approver = event.info['approver']
    user = User().load(dataset['userId'], force=True)
    html = mail_utils.renderTemplate('mdb.dataset_approved.mako', {
        'dataset': dataset,
        'user': user,
        'approver': approver
    })

    email_address = user['email']

    mail_utils.sendMail('Materials Data Bank: Dataset approved.', html, [email_address])


def load(info):
    info['apiRoot'].mdb = Prefix()
    info['apiRoot'].mdb.datasets = Dataset()

    events.bind('mdb.dataset.approved', 'moveToCuratedAssetStore',
                move_to_curated_assetstore)

    events.bind('mdb.dataset.created', 'sendCreated', send_created)
    events.bind('mdb.dataset.approved', 'sendApproved', send_approved)
