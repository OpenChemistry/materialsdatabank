from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource
from girder.constants import AccessType, TokenScope

from girder.plugins.materialsdatabank.models.tomo import Tomo

class Tomo(Resource):

    def __init__(self):
        super(Tomo, self).__init__()
        self.resourceName = 'tomo'

        self.route('GET', (':id', 'structures',), self.fetch_structures)
        self.route('GET', (':id', 'reconstructions',), self.fetch_reconstructions)
        self.route('GET', (':id', 'projections',), self.fetch_projections)

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the structures.')
        .modelParam('id', 'The experiment id',
                    model='tomo', level=AccessType.READ, paramType='path')
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_structures(self, tomo):
        return tomo

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the reconstructions.')
        .modelParam('id', 'The experiment id',
                    model='tomo', level=AccessType.READ, paramType='path')
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_reconstructions(self, tomo):
        return tomo

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the projections.')
        .modelParam('id', 'The experiment id',
                    model='tomo', level=AccessType.READ, paramType='path')
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_projections(self, tomo):
        return tomo

