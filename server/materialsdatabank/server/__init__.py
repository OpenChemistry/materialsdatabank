from girder.plugins.materialsdatabank.models.tomo import Tomo

from .rest import Tomo

def load(info):
    info['apiRoot'].tomo = Tomo()
