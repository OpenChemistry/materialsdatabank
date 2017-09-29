from .rest import Tomo

def load(info):
    info['apiRoot'].tomo = Tomo()
