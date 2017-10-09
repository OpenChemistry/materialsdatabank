import cherrypy

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
        self.route('GET', ('search',), self.search_tomo)
        self.route('GET', (':id',), self.fetch_tomo)
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
        self.requireParams(['authors', 'title', 'url'], tomo)
        authors = tomo.get('authors')
        title = tomo.get('title')
        url = tomo.get('url')
        microscope = tomo.get('microscope')
        image_file_id = tomo.get('imageFileId')

        tomo = self.model('tomo', 'materialsdatabank').create(
            authors, title=title, url=url, microscope=microscope, image_file_id=image_file_id,
            public=True, user=self.getCurrentUser())

        cherrypy.response.status = 201
        cherrypy.response.headers['Location'] = '/tomo/%s' % tomo['_id']

        return tomo

    @access.public(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Create a structure.')
        .modelParam('id', 'The experiment id',
                    model='tomo', plugin='materialsdatabank',
                    level=AccessType.READ, paramType='path')
        .jsonParam('structure', 'Tomo document', required=True, paramType='body')
    )
    def create_structure(self, tomo, structure):
        self.requireParams(['cjsonFileId', 'xyzFileId', 'cmlFileId'], structure)
        cjson_file_id = structure.get('cjsonFileId')
        xyz_file_id = structure.get('xyzFileId')
        cml_file_id = structure.get('cmlFileId')

        structure = self.model('structure', 'materialsdatabank').create(
            tomo, cjson_file_id, xyz_file_id, cml_file_id, public=True, user=self.getCurrentUser())

        cherrypy.response.status = 201
        cherrypy.response.headers['Location'] = '/tomo/%s/structures/%s' % (tomo['_id'], structure['_id'])

        return structure

    @access.public(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Create a reconstruction.')
        .modelParam('id', 'The experiment id',
                    model='tomo', plugin='materialsdatabank',
                    level=AccessType.READ, paramType='path')
        .jsonParam('reconstruction', 'Tomo document', required=True, paramType='body')
    )
    def create_reconstruction(self, tomo, reconstruction):
        self.requireParams(['emdFileId', 'tiffFileId'], reconstruction)
        emd_file_id = reconstruction.get('emdFileId')
        tiff_file_id = reconstruction.get('tiffFileId')

        reconstruction = self.model('reconstruction', 'materialsdatabank').create(
            tomo, emd_file_id, tiff_file_id, public=True, user=self.getCurrentUser())

        cherrypy.response.status = 201
        cherrypy.response.headers['Location'] = '/tomo/%s/reconstructions/%s' % (tomo['_id'], reconstruction['_id'])

        return reconstruction
    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the structures.')
        .modelParam('id', 'The experiment id',
                    model='tomo', plugin='materialsdatabank',
                    level=AccessType.READ, paramType='path')
                       .pagingParams(defaultSort=None)
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_structures(self, tomo, limit, offset, sort=None):
        model = self.model('structure', 'materialsdatabank')
        # Note: This is potentially very costly if we get alot of records!
        cursor = model.find(tomo['_id'], sort=sort)
        user = self.getCurrentUser()
        return list(model.filterResultsByPermission(cursor=cursor, user=user,
                                                    level=AccessType.READ,
                                                    limit=limit, offset=offset))

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the reconstructions.')
        .modelParam('id', 'The experiment id',
                    model='tomo', plugin='materialsdatabank',
                    level=AccessType.READ, paramType='path')
        .pagingParams(defaultSort=None)
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_reconstructions(self, tomo, limit, offset, sort=None):
        model = self.model('reconstruction', 'materialsdatabank')
        cursor = model.find(tomo['_id'], sort=sort)
        user = self.getCurrentUser()
        return list(model.filterResultsByPermission(cursor=cursor, user=user,
                                                    level=AccessType.READ,
                                                    limit=limit, offset=offset))

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

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the projections.')
        .jsonParam('terms', 'A JSON list of search terms', required=False,
                   requireArray=True)
        .pagingParams(defaultSort=None)
    )
    def search_tomo(self, terms, limit, offset, sort=None):
        return list(self.model('tomo', 'materialsdatabank').search(terms, offset=offset,
                                                              limit=limit, sort=sort,
                                                              user=self.getCurrentUser()))

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the projections.')
        .modelParam('id', 'The experiment id',
                    model='tomo', plugin='materialsdatabank',
                    level=AccessType.READ, paramType='path')
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_tomo(self, tomo):
        return tomo
