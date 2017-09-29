from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource
from girder.constants import AccessType, TokenScope

from girder.plugins.materialsdatabank.models.tomo import Tomo

class Tomo(Resource):

    def __init__(self):
        super(Tomo, self).__init__()
        self.resourceName = 'tomo'

        self.route('POST', (), self.create_tomo)
        self.route('GET', (':id', 'structures',), self.fetch_structures)
        self.route('GET', (':id', 'reconstructions',), self.fetch_reconstructions)
        self.route('GET', (':id', 'projections',), self.fetch_projections)
        self.route('POST', (':id', 'structures',), self.create_structure)
        self.route('POST', (':id', 'reconstructions',), self.create_reconstruction)

    @access.public(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Create a tomo document.')
        .jsonParam('tomo', 'Tomo document', required=True, paramType='body')
    )
    def create_tomo(self, tomo):
        self.requireParams(tomo, ['authors', 'paper'])
        authors = tomo.get('authors')
        paper = tomo.get('paper')
        microscope = tomo.get('microscope')

        return self.model('tomo', 'materialsdatabank').create(
                authors, paper=paper, microscope=microscope, public=True,
                user=self.getCurrentUser())

    @access.public(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Create a structure.')
        .modelParam('id', 'The experiment id',
                    model='tomo', plugin='materialsdatabank',
                    level=AccessType.READ, paramType='path')
        .jsonParam('structure', 'Tomo document', required=True, paramType='body')
    )
    def create_structure(self, tomo, structure):
        self.requireParams(structure, ['fileId'])
        file_id = structure.get('fileId')

        return self.model('structure', 'materialsdatabank').create(
            tomo, file_id, public=True, user=self.getCurrentUser())

    @access.public(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Create a reconstruction.')
        .modelParam('id', 'The experiment id',
                    model='tomo', plugin='materialsdatabank',
                    level=AccessType.READ, paramType='path')
        .jsonParam('reconstruction', 'Tomo document', required=True, paramType='body')
    )
    def create_reconstruction(self, tomo, reconstruction):
        self.requireParams(reconstruction, ['fileId'])
        file_id = reconstruction.get('fileId')

        return self.model('reconstruction', 'materialsdatabank').create(
            tomo, file_id, public=True, user=self.getCurrentUser())

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the structures.')
        .modelParam('id', 'The experiment id',
                    model='tomo', plugin='materialsdatabank',
                    level=AccessType.READ, paramType='path')
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
        .pagingParams(defaultSort=None)
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_reconstructions(self, tomo, limit, offset, sort):

        cursor = self.model('reconstructions').find(tomo['_id'])
        user = self.getCurrentUser()
        return self.filterResultsByPermission(cursor=cursor, user=user,
                                                level=AccessType.READ,
                                                limit=limit, offset=offset,
                                                sort=sort)

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the projections.')
        .modelParam('id', 'The experiment id',
                    model='tomo', plugin='materialsdatabank',
                    level=AccessType.READ, paramType='path')
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_projections(self, tomo):
        return tomo

