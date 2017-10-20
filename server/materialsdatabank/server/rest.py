import cherrypy

from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, RestException
from girder.constants import AccessType, TokenScope
from girder.models.file import File

from girder.plugins.materialsdatabank.models.dataset import Dataset as DatasetModel
from girder.plugins.materialsdatabank.models.reconstruction import Reconstruction as ReconstructionModel
from girder.plugins.materialsdatabank.models.structure import Structure as StructureModel
from girder.plugins.materialsdatabank.models.projection import Projection as ProjectionModel

CHUNK_SIZE = 1024 * 1024;

class Dataset(Resource):

    def __init__(self):
        super(Dataset, self).__init__()
        self.route('POST', (), self.create_dataset)
        self.route('GET', ('search',), self.search_dataset)
        self.route('GET', (), self.find_dataset)
        self.route('GET', (':id',), self.fetch_dataset)
        self.route('GET', (':id','image'), self.fetch_image)
        self.route('PATCH', (':id', ), self.update_dataset)
        self.route('GET', (':id', 'structures',), self.fetch_structures)
        self.route('GET', (':id', 'structures', ':structureId', ':format'), self.fetch_structure)
        self.route('PATCH', (':id', 'structures', ':structureId'), self.update_structure)
        self.route('GET', (':id', 'reconstructions',), self.fetch_reconstructions)
        self.route('GET', (':id', 'reconstructions', ':reconstructionId', ':format'), self.fetch_reconstruction)
        self.route('PATCH', (':id', 'reconstructions', ':reconstructionId'), self.update_reconstruction)
        self.route('GET', (':id', 'projections',), self.fetch_projections)
        self.route('POST', (':id', 'structures',), self.create_structure)
        self.route('POST', (':id', 'reconstructions',), self.create_reconstruction)

    def _requireParamOneOf(self, require_one_of, provided):

        have_one = False
        for param in require_one_of:
            if provided is not None and param in provided:
                have_one = True

        if not have_one:
            raise RestException('One of "%s" is required.' % require_one_of)

    @access.user(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Create a dataset document.')
        .jsonParam('dataset', 'Dataset document', required=True, paramType='body')
    )
    def create_dataset(self, dataset):
        self.requireParams(['authors', 'title'], dataset)
        authors = dataset.get('authors')
        if not isinstance(authors, list):
            authors = authors.split(' and ')
        title = dataset.get('title')
        url = dataset.get('url')
        microscope = dataset.get('microscope')
        image_file_id = dataset.get('imageFileId')
        slug = dataset.get('slug')

        dataset = DatasetModel().create(
            authors, title=title, url=url, microscope=microscope, image_file_id=image_file_id,
            slug=slug, user=self.getCurrentUser())

        cherrypy.response.status = 201
        cherrypy.response.headers['Location'] = '/datasets/%s' % dataset['_id']

        return dataset

    @access.user(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Update dataset.')
        .param('id', 'The dataset id', paramType='path')
        .jsonParam('updates', 'Update document', required=True, paramType='body')
    )
    def update_dataset(self, id, updates):
        model = DatasetModel()
        dataset = model.load(id, user=self.getCurrentUser(), level=AccessType.WRITE)

        if 'public' in updates:
            dataset = DatasetModel().update(dataset, user=self.getCurrentUser(),
                                            public=updates.get('public'))

        return dataset

    @access.user(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Create a structure.')
        .modelParam('id', 'The dataset id',
                    model=DatasetModel, destName='dataset',
                    level=AccessType.READ, paramType='path')
        .jsonParam('structure', 'Dataset document', required=True, paramType='body')
    )
    def create_structure(self, dataset, structure):
        self._requireParamOneOf(['cjsonFileId', 'xyzFileId'], structure)

        cjson_file_id = structure.get('cjsonFileId')
        xyz_file_id = structure.get('xyzFileId')
        cml_file_id = structure.get('cmlFileId')

        structure = StructureModel().create(
            dataset, cjson_file_id, xyz_file_id, cml_file_id, user=self.getCurrentUser())

        cherrypy.response.status = 201
        cherrypy.response.headers['Location'] = '/datasets/%s/structures/%s' % (dataset['_id'], structure['_id'])

        return structure

    @access.user(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Update structure.')
        .param('id', 'The dataset id ( not used )', paramType='path')
        .modelParam('structureId', 'The structure id',
                    model=StructureModel, destName='structure',
                    level=AccessType.WRITE, paramType='path')
        .jsonParam('updates', 'Update document', required=True, paramType='body')
    )
    def update_structure(self, id, structure, updates):
        if 'public' in updates:
            structure = StructureModel().update(structure, user=self.getCurrentUser(),
                                                public=updates['public'])

        return structure


    @access.user(scope=TokenScope.DATA_WRITE)
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
            dataset, emd_file_id, tiff_file_id, user=self.getCurrentUser())

        cherrypy.response.status = 201
        cherrypy.response.headers['Location'] = '/datasets/%s/reconstructions/%s' % (dataset['_id'], reconstruction['_id'])

        return reconstruction

    @access.user(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Update reconstruction.')
        .param('id', 'The dataset id ( not used )', paramType='path')
        .modelParam('reconstructionId', 'The reconstruction id',
                    model=ReconstructionModel, destName='reconstruction',
                    level=AccessType.WRITE, paramType='path')
        .jsonParam('updates', 'Update document', required=True, paramType='body')
    )
    def update_reconstruction(self, id, reconstruction, updates):
        if 'public' in updates:
            reconstruction = ReconstructionModel().update(reconstruction, user=self.getCurrentUser(),
                                                          public=updates['public'])

        return reconstruction

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the structures.')
        .param('id', 'The dataset id',
               paramType='path')
        .pagingParams(defaultSort=None)
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_structures(self, id, limit, offset, sort=None):
        dataset = DatasetModel().load(id, user=self.getCurrentUser(), level=AccessType.READ)
        model = StructureModel()
        # Note: This is potentially very costly if we get alot of records!
        cursor = model.find(dataset['_id'], sort=sort)
        user = self.getCurrentUser()
        return list(model.filterResultsByPermission(cursor=cursor, user=user,
                                                    level=AccessType.READ,
                                                    limit=limit, offset=offset))


    @access.cookie
    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the structure.')
        .param('id', 'The dataset id ( not used )',
               paramType='path')
        .modelParam('structureId', 'The structure id',
                    model=StructureModel, destName='structure',
                    level=AccessType.READ, paramType='path')
        .param('format', 'The format', paramType='path')
        .param('contentDisposition', 'Specify the Content-Disposition response '
               'header disposition-type value.', required=False,
               enum=['inline', 'attachment'], default='attachment')
        .pagingParams(defaultSort=None)
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_structure(self, id, structure, format, contentDisposition, limit, offset, sort=None):
        supported_formats = ['cjson', 'cml', 'xyz']

        if format not in supported_formats:
            raise RestException('"%s" is not a supported format.')

        file_model = File()
        def downloadFile(structure, id):
            file = file_model.load(structure[id], force=True)

            return File().download(file, contentDisposition=contentDisposition)

        if format == 'cjson':
            return downloadFile(structure, 'cjsonFileId')

        if format == 'cml':
            return downloadFile(structure, 'cmlFileId')

        if format == 'xyz':
            return downloadFile(structure, 'xyzFileId')


    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the reconstructions.')
        .param('id', 'Dataset id', paramType='path')
        .pagingParams(defaultSort=None)
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_reconstructions(self, id, limit, offset, sort=None):
        dataset = DatasetModel().load(id, user=self.getCurrentUser(), level=AccessType.READ)
        model = ReconstructionModel()
        cursor = model.find(dataset['_id'], sort=sort)
        user = self.getCurrentUser()
        return list(model.filterResultsByPermission(cursor=cursor, user=user,
                                                    level=AccessType.READ,
                                                    limit=limit, offset=offset))

    @access.cookie
    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the reconstruction.')
        .param('id', 'The dataset id ( not used )',
                    paramType='path')
        .modelParam('reconstructionId', 'The reconstruction id',
                    model=ReconstructionModel, destName='reconstruction',
                    level=AccessType.READ, paramType='path')
        .param('format', 'The format', paramType='path')
        .param('contentDisposition', 'Specify the Content-Disposition response '
               'header disposition-type value.', required=False,
               enum=['inline', 'attachment'], default='attachment')
        .pagingParams(defaultSort=None)
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_reconstruction(self, id, reconstruction, format, contentDisposition, limit, offset, sort=None):
        supported_formats = ['emd', 'tiff']

        if format not in supported_formats:
            raise RestException('"%s" is not a supported format.')

        file_model = File()
        def downloadFile(reconstruction, id):
            file = file_model.load(reconstruction[id], force=True)

            return File().download(file, contentDisposition=contentDisposition)

        if format == 'emd':
            return downloadFile(reconstruction, 'emdFileId')

        if format == 'tiff':
            return downloadFile(reconstruction, 'tiffFileId')

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the projections.')
        .param('id', 'The dataset id', paramType='path')
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_projections(self, id):
        dataset = DatasetModel().load(id, user=self.getCurrentUser(), level=AccessType.READ)
        return id

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
        .param('id', 'Object id or slug', paramType='path')
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_dataset(self, id):
        return DatasetModel().load(id, user=self.getCurrentUser(), level=AccessType.READ)

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

    @access.cookie
    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the image.')
        .param('id', 'The dataset id ( not used )',
               paramType='path')
        .pagingParams(defaultSort=None)
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_image(self, id):
        dataset = DatasetModel().load(id, user=self.getCurrentUser(), level=AccessType.READ)
        if 'imageFileId' in dataset:
            file_model = File()
            file = file_model.load(dataset['imageFileId'], force=True)
            return File().download(file, contentDisposition='inline')

        return None
