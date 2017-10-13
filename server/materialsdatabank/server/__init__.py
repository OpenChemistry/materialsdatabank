from girder.api.rest import Prefix
from .rest import Tomo

def load(info):
    info['apiRoot'].mdb = Prefix()
    info['apiRoot'].mdb.tomo = Tomo()
