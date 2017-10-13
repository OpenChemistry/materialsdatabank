from girder.api.rest import Prefix
from .rest import Dataset

def load(info):
    info['apiRoot'].mdb = Prefix()
    info['apiRoot'].mdb.dataset = Dataset()
