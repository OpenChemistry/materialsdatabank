import cherrypy

from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, RestException
from girder.constants import AccessType, TokenScope
from girder.models.file import File
from girder.models.group import Group
from girder.api.rest import setResponseHeader, setContentDisposition

from girder.plugins.materialsdatabank.models.dataset import Dataset as DatasetModel
from girder.plugins.materialsdatabank.models.reconstruction import Reconstruction as ReconstructionModel
from girder.plugins.materialsdatabank.models.structure import Structure as StructureModel
from girder.plugins.materialsdatabank.models.projection import Projection as ProjectionModel

from girder.plugins.materialsdatabank.utils import is_user_curator

from materialsdatabank.tasks import r1, R1FactorResultTransform
from girder_worker_utils.transforms.girder_io import GirderFileId
import tempfile
from PIL import Image
from shutil import copyfileobj
from six import BytesIO
import h5py as h5

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
        self.route('PUT', (':id', 'validate' ), self.validate)

        self.route('POST', (':id', 'structures',), self.create_structure)
        self.route('GET', (':id', 'structures',), self.fetch_structures)
        self.route('GET', (':id', 'structures', ':structureId', ':format'), self.fetch_structure)
        self.route('PATCH', (':id', 'structures', ':structureId'), self.update_structure)

        self.route('POST', (':id', 'reconstructions',), self.create_reconstruction)
        self.route('GET', (':id', 'reconstructions',), self.fetch_reconstructions)
        self.route('GET', (':id', 'reconstructions', ':reconstructionId', ':format'), self.fetch_reconstruction)
        self.route('PATCH', (':id', 'reconstructions', ':reconstructionId'), self.update_reconstruction)

        self.route('POST', (':id', 'projections',), self.create_projection)
        self.route('GET', (':id', 'projections',), self.fetch_projections)
        self.route('GET', (':id', 'projections', ':projectionId', ':format'), self.fetch_projection)
        self.route('PATCH', (':id', 'projections', ':projectionId'), self.update_projection)


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

        dataset = DatasetModel().create(
            authors, title=title, url=url, microscope=microscope, image_file_id=image_file_id,
            user=self.getCurrentUser())

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
        # Datasets are only editable if the current user is a curator,
        # or if the editable field on the dataset is true

        user = self.getCurrentUser()
        is_curator = is_user_curator(user)

        model = DatasetModel()
        dataset = model.load(id, user=self.getCurrentUser(), level=AccessType.WRITE)

        editable = dataset.get('editable', False)
        if not is_curator and not editable:
            raise RestException('Only a curator can edit a locked dataset')

        if not is_curator and 'editable' in updates:
            del updates['editable']

        authors = updates.get('authors', None)
        if authors is not None and not isinstance(authors, list):
            authors = authors.split(' and ')
            updates['authors'] = authors

        dataset = DatasetModel().update(dataset, updates, user=self.getCurrentUser(),
                                        public=updates.get('public'),
                                        validation=updates.get('validation'))

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
        self._requireParamOneOf(['xyzFileId'], structure)
        xyz_file_id = structure.get('xyzFileId')

        structure = StructureModel().create(
            dataset, xyz_file_id=xyz_file_id, user=self.getCurrentUser())

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
        self.requireParams([
            'emdFileId',
            'resolution',
            'cropHalfWidth',
            'volumeSize',
            'zDirection',
            'bFactor',
            'hFactor',
            'axisConvention'
        ], reconstruction)
        emd_file_id = reconstruction.get('emdFileId')
        resolution = reconstruction.get('resolution')
        crop_half_width = reconstruction.get('cropHalfWidth')
        volume_size = reconstruction.get('volumeSize')
        z_direction = reconstruction.get('zDirection')
        b_factor = reconstruction.get('bFactor')
        h_factor = reconstruction.get('hFactor')
        axis_convention = reconstruction.get('axisConvention')

        reconstruction = ReconstructionModel().create(
            dataset, emd_file_id, resolution, crop_half_width,
            volume_size, z_direction, b_factor, h_factor,
            axis_convention, user=self.getCurrentUser())

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
        public = updates.get('public', None)
        reconstruction = ReconstructionModel().update(reconstruction, updates, user=self.getCurrentUser(),
                                                        public=public)
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

    def _set_content_disposition(self, name, content_disposition, mime_type=None):
        setResponseHeader(
            'Content-Type',
            mime_type or 'application/octet-stream')
        setContentDisposition(name, content_disposition or 'attachment')
#        setResponseHeader('Content-Length', size)


    def _to_tiff(self, emd_file_id):
        file = File().load(emd_file_id, force=True)
        local_file_path = File().getLocalFilePath(file)

        def _read(file_path):
            with h5.File(file_path, 'r') as f:
                emdgrp = f['data/tomography']
                data = emdgrp['data'][:]
                slices = []
                for slice in data:
                    slices.append(Image.fromarray(slice, mode='F'))

                io = BytesIO()
                slices[0].save(io, format='tiff', compression='tiff_deflate',  save_all=True, append_images=slices[1:])
                io.seek(0)

                def _stream():
                    bytes_read = 0
                    while True:
                        chunk = io.read(CHUNK_SIZE)

                        if not chunk:
                            break
                        bytes_read += len(chunk)
                        yield chunk

                return _stream

        if local_file_path is None:
            # Assetstore is not local, so we will have to download to temp file.
            with tempfile.NamedTemporaryFile() as f:
                copyfileobj(File().download(file), f)
                f.seek(0)
                return _read(f.name)
        else:
            return _read(local_file_path)



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
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_reconstruction(self, id, reconstruction, format, contentDisposition):
        supported_formats = ['emd', 'tiff']

        if format not in supported_formats:
            raise RestException('"%s" is not a supported format.')

        file_model = File()
        emd_file = file_model.load(reconstruction['emdFileId'], force=True)

        if format == 'emd':
            return File().download(emd_file, contentDisposition=contentDisposition)
        elif format == 'tiff':
            self._set_content_disposition('%s.tiff' % emd_file['name'], contentDisposition, 'image/tiff')
            return self._to_tiff(reconstruction['emdFileId'])

    # Projections endpoints

    @access.user(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Create a projection.')
        .modelParam('id', 'The dataset id',
                    model=DatasetModel, destName='dataset',
                    level=AccessType.READ, paramType='path')
        .jsonParam('projection', 'Dataset document', required=True, paramType='body')
    )
    def create_projection(self, dataset, projection):
        self.requireParams(['emdFileId'], projection)
        emd_file_id = projection.get('emdFileId')

        projection = ProjectionModel().create(
            dataset, emd_file_id, user=self.getCurrentUser())

        cherrypy.response.status = 201
        cherrypy.response.headers['Location'] = '/datasets/%s/projections/%s' % (dataset['_id'], projection['_id'])

        return projection

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the projections.')
        .param('id', 'Dataset id', paramType='path')
        .pagingParams(defaultSort=None)
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_projections(self, id, limit, offset, sort=None):
        dataset = DatasetModel().load(id, user=self.getCurrentUser(), level=AccessType.READ)
        model = ProjectionModel()
        cursor = model.find(dataset['_id'], sort=sort)
        user = self.getCurrentUser()
        return list(model.filterResultsByPermission(cursor=cursor, user=user,
                                                    level=AccessType.READ,
                                                    limit=limit, offset=offset))

    @access.cookie
    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the projection.')
        .param('id', 'The dataset id ( not used )',
                    paramType='path')
        .modelParam('projectionId', 'The projection id',
                    model=ProjectionModel, destName='projection',
                    level=AccessType.READ, paramType='path')
        .param('format', 'The format', paramType='path')
        .param('contentDisposition', 'Specify the Content-Disposition response '
               'header disposition-type value.', required=False,
               enum=['inline', 'attachment'], default='attachment')
        .pagingParams(defaultSort=None)
        .errorResponse('ID was invalid.')
        .errorResponse('Read permission denied on the item.', 403)
    )
    def fetch_projection(self, id, projection, format, contentDisposition, limit, offset, sort=None):
        supported_formats = ['emd', 'tiff']

        if format not in supported_formats:
            raise RestException('"%s" is not a supported format.')

        file_model = File()
        def downloadFile(projection, id):
            file = file_model.load(projection[id], force=True)

            return file_model.download(file, contentDisposition=contentDisposition)

        if format == 'emd':
            return downloadFile(projection, 'emdFileId')

        if format == 'tiff':
            return downloadFile(projection, 'tiffFileId')

    @access.user(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Update projection.')
        .param('id', 'The dataset id ( not used )', paramType='path')
        .modelParam('projectionId', 'The projection id',
                    model=ProjectionModel, destName='projection',
                    level=AccessType.WRITE, paramType='path')
        .jsonParam('updates', 'Update document', required=True, paramType='body')
    )
    def update_projection(self, id, projection, updates):
        if 'public' in updates:
            projection = ProjectionModel().update(projection, user=self.getCurrentUser(),
                                                          public=updates['public'])

        return projection

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
        .param('slug', 'The human readable MDB Id', required=False)
        .pagingParams(defaultSort=None)
    )
    def find_dataset(self, authors=None, title=None, atomicSpecies=None, slug=None, offset=0, limit=None,
                  sort=None, user=None):
        model = DatasetModel()
        return list(model.find(
            authors=authors, title=title, atomic_species=atomicSpecies, slug=slug,
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

    @access.user(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Validate a dataset.')
        .modelParam('id', 'The dataset id',
                    model=DatasetModel, destName='dataset',
                    level=AccessType.WRITE, paramType='path')
    )
    def validate(self, dataset):

        user = self.getCurrentUser()
        is_curator = is_user_curator(user)

        if not is_curator:
            raise RestException('Insufficient permissions to validate dataset.')

        structure = list(StructureModel().find(dataset['_id']))
        assert len(structure) > 0
        structure = structure[0]
        projection = list(ProjectionModel().find(dataset['_id']))
        assert len(projection) > 0
        projection = projection[0]
        reconstruction = list(ReconstructionModel().find(dataset['_id']))
        assert len(reconstruction) > 0
        reconstruction = reconstruction[0]

        result = r1.delay(reconstruction, GirderFileId(str(projection['emdFileId'])),
            GirderFileId(str(structure['xyzFileId'])), girder_result_hooks=[
            R1FactorResultTransform(str(dataset['_id']))
        ])

        validation = {
            'jobId': result.job['_id']
        }

        DatasetModel().update(dataset, user=self.getCurrentUser(), validation=validation)

        dataset = DatasetModel().load(dataset['_id'], user=self.getCurrentUser(), level=AccessType.READ)

        return dataset
