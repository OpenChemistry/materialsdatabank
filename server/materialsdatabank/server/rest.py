import cherrypy

from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource
from girder.constants import AccessType, TokenScope

from girder.plugins.materialsdatabank.models.dataset import Dataset as DatasetModel
from girder.plugins.materialsdatabank.models.reconstruction import Reconstruction as ReconstructionModel
from girder.plugins.materialsdatabank.models.structure import Structure as StructureModel
from girder.plugins.materialsdatabank.models.projection import Projection as ProjectionModel


class Dataset(Resource):

    def __init__(self):
        super(Dataset, self).__init__()
        self.route('POST', (), self.create_dataset)
        self.route('GET', ('search',), self.search_dataset)
        self.route('GET', (), self.find_dataset)
        self.route('GET', (':id',), self.fetch_dataset)
        self.route('GET', (':id', 'structures',), self.fetch_structures)
        self.route('GET', (':id', 'reconstructions',), self.fetch_reconstructions)
        self.route('GET', (':id', 'projections',), self.fetch_projections)
        self.route('POST', (':id', 'structures',), self.create_structure)
        self.route('POST', (':id', 'reconstructions',), self.create_reconstruction)

    @access.public(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Create a dataset document.')
        .jsonParam('dataset', 'Dataset document', required=True, paramType='body')
    )
    def create_dataset(self, dataset):
        self.requireParams(['authors', 'title', 'url'], dataset)
        authors = dataset.get('authors')
        title = dataset.get('title')
        url = dataset.get('url')
        microscope = dataset.get('microscope')
        image_file_id = dataset.get('imageFileId')

        dataset = DatasetModel().create(
            authors, title=title, url=url, microscope=microscope, image_file_id=image_file_id,
            public=True, user=self.getCurrentUser())

        cherrypy.response.status = 201
        cherrypy.response.headers['Location'] = '/datasets/%s' % dataset['_id']

        return dataset

    @access.public(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Create a structure.')
        .modelParam('id', 'The dataset id',
                    model=DatasetModel, destName='dataset',
                    level=AccessType.READ, paramType='path')
        .jsonParam('structure', 'Dataset document', required=True, paramType='body')
    )
    def create_structure(self, dataset, structure):
        self.requireParams(['cjsonFileId', 'xyzFileId', 'cmlFileId'], structure)
        cjson_file_id = structure.get('cjsonFileId')
        xyz_file_id = structure.get('xyzFileId')
        cml_file_id = structure.get('cmlFileId')

        structure = StructureModel().create(
            dataset, cjson_file_id, xyz_file_id, cml_file_id, public=True, user=self.getCurrentUser())

        cherrypy.response.status = 201
        cherrypy.response.headers['Location'] = '/datasets/%s/structures/%s' % (dataset['_id'], structure['_id'])

        return structure

    @access.public(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Create a reconstruction.')
        .modelParam('id', 'The dataset id',
                    model=DatasetModel, destName='dataset',
                    level=AccessType.READ, paramType='path')
        .jsonParam('reconstruction', 'Dataset document', required=True, paramType='body')
    )
    def create_reconstruction(self, dataset, reconstruction):
        self.requireParams(['emdFileId', 'tiffFileId'], reconstruction)
        emd_file_id = reconstruction.get('emdFileId')
        tiff_file_id = reconstruction.get('tiffFileId')

        reconstruction = ReconstructionModel().create(
            dataset, emd_file_id, tiff_file_id, public=True, user=self.getCurrentUser())

        cherrypy.response.status = 201
        cherrypy.response.headers['Location'] = '/datasets/%s/reconstructions/%s' % (dataset['_id'], reconstruction['_id'])

        return reconstruction
    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the structures.')
        .modelParam('id', 'The dataset id',
                    model=DatasetModel, destName='dataset',
                    level=AccessType.READ, paramType='path')
        .pagingParams(defaultSort=None)
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_structures(self, dataset, limit, offset, sort=None):
        model = StructureModel()
        # Note: This is potentially very costly if we get alot of records!
        cursor = model.find(dataset['_id'], sort=sort)
        user = self.getCurrentUser()
        return list(model.filterResultsByPermission(cursor=cursor, user=user,
                                                    level=AccessType.READ,
                                                    limit=limit, offset=offset))

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the reconstructions.')
        .modelParam('id', 'The dataset id',
                    model=DatasetModel, destName='dataset',
                    level=AccessType.READ, paramType='path')
        .pagingParams(defaultSort=None)
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_reconstructions(self, dataset, limit, offset, sort=None):
        model = ReconstructionModel()
        cursor = model.find(dataset['_id'], sort=sort)
        user = self.getCurrentUser()
        return list(model.filterResultsByPermission(cursor=cursor, user=user,
                                                    level=AccessType.READ,
                                                    limit=limit, offset=offset))

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the projections.')
        .modelParam('id', 'The dataset id',
                    model=DatasetModel, destName='dataset',
                    level=AccessType.READ, paramType='path')
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_projections(self, dataset):
        return dataset

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the projections.')
        .jsonParam('terms', 'A JSON list of search terms', required=False,
                   requireArray=True)
        .pagingParams(defaultSort=None)
    )
    def search_dataset(self, terms, limit, offset, sort=None):
        return list(DatasetModel().search(terms, offset=offset,
                                          limit=limit, sort=sort,
                                          user=self.getCurrentUser()))

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the dataset.')
        .modelParam('id', destName='dataset',
                    model=DatasetModel,
                    level=AccessType.READ, paramType='path')
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_dataset(self, dataset):
        return dataset

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the projections.')
        .jsonParam('authors', 'A JSON list of author search terms', required=False,
                   requireArray=True)
        .param('title', 'A title search terms', required=False)
        .jsonParam('atomicSpecies', 'A JSON list of atomic species search terms', required=False,
                   requireArray=True)
        .pagingParams(defaultSort=None)
    )
    def find_dataset(self, authors=None, title=None, atomicSpecies=None, offset=0, limit=None,
                  sort=None, user=None):
        model = DatasetModel()
        return list(model.find(
            authors=authors, title=title, atomic_species=atomicSpecies,
            offset=offset, limit=limit, sort=sort, user=self.getCurrentUser()))
