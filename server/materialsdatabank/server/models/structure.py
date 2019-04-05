import json
from jsonpath_rw import parse
from six import BytesIO
from bson.objectid import ObjectId

from girder.models.model_base import ValidationException
from girder.constants import AccessType
from girder.models.upload import Upload
from girder.models.item import Item
from girder.models.file import File
from girder.models.group import Group


from .base import BaseAccessControlledModel
from .. import avogadro

class Structure(BaseAccessControlledModel):

    def initialize(self):
        self.name = 'mdb.structures'
        self.ensureIndices(['datasetId'])

    def validate(self, structure):
        return structure

    def _generate_file(self, input, input_format, output_format, output_name,
                       output_parent_id, user):
        output = avogadro.convert_str(input, input_format, output_format)
        size = len(output)
        output = BytesIO(output.encode('utf8'))
        output = Upload().uploadFromFile(
            output, size=size, name=output_name, parentType='folder',
            parent={'_id': output_parent_id},
            user=user, mimeType='application/octet-stream')

        return output

    def create(self, dataset, cjson_file_id=None, xyz_file_id=None, cml_file_id=None,
               user=None, public=False):

        # Determine our input format
        if cjson_file_id is not None:
            input_format = 'cjson'
            file_id = cjson_file_id
        elif xyz_file_id is not None:
            input_format = 'xyz'
            file_id = xyz_file_id
        else:
            raise ValidationException('No valid input format provided.')

        if cjson_file_id is None or xyz_file_id is None or cml_file_id is None:
            file = self.model('file').load(file_id, user=user)
            with self.model('file').open(file) as fp:
                input = fp.read().decode()

            # Get folder
            item = Item().load(file['itemId'], user=user)
            folder_id = item['folderId']

            # See what we need to generate
            if cjson_file_id is None:
                cjson_file = self._generate_file(input, input_format, 'cjson',
                                                 '%s.cjson' % file['name'],
                                                 folder_id, user)
                cjson_file_id = cjson_file['_id']

            if cml_file_id is None:
                cml_file = self._generate_file(input, input_format, 'cml',
                                               '%s.cml' % file['name'],
                                               folder_id, user)
                cml_file_id = cml_file['_id']

            if xyz_file_id is None:
                xyz_file = self._generate_file(input, input_format, 'xyz',
                                               '%s.xyz' % file['name'],
                                               folder_id, user)
                xyz_file_id = xyz_file['_id']

        structure = {
            'datasetId': dataset['_id'],
            'cjsonFileId': cjson_file['_id'],
            'xyzFileId': ObjectId(xyz_file_id),
            'cmlFileId': cml_file['_id']
        }

        cjson_file = self.model('file').load(cjson_file_id, user=user)
        with self.model('file').open(cjson_file) as fp:
            cjson = json.loads(fp.read().decode())

        path = 'atoms.elements.number'
        species = parse(path).find(cjson)
        if species:
            species = species[0].value
        else:
            raise ValidationException('%s doesn\'t exist.' % path)

        species = species
        structure['numberOfAtoms'] = len(species)
        structure['atomicSpecies'] = list(set(species))
        structure['cjson'] = cjson

        # Update the species at the dataset level
        # Import here to avoid circular dep issue.
        from girder.plugins.materialsdatabank.models.dataset import Dataset
        Dataset().update(dataset,
            user=user,atomic_species=species)

        self.setPublic(structure, public)
        curator = list(Group().find({
            'name': 'curator',
        }))
        if len(curator) > 0:
            self.setGroupAccess(structure, group=curator[0], level=AccessType.ADMIN)
        self.setUserAccess(structure, user=user, level=AccessType.ADMIN)

        if user:
            structure['userId'] = user['_id']
            self.setUserAccess(structure, user=user, level=AccessType.ADMIN)
        else:
            structure['userId'] = None

        return self.save(structure)

    def update(self, structure, structure_updates, user=None, public=None):
        query = {
            '_id': structure['_id']
        }
        updates = {}

        if public is not None:
            updates.setdefault('$set', {})['public'] = public

        files_to_delete = []
        if 'xyzFileId' in structure_updates:
            xyz_file_id = structure_updates['xyzFileId']
            file = self.model('file').load(xyz_file_id, user=user)
            item = Item().load(file['itemId'], user=user)
            folder_id = item['folderId']
            with self.model('file').open(file) as fp:
                input = fp.read().decode()
            cjson_file = self._generate_file(input, 'xyz', 'cjson',
                                             '%s.cjson' % file['name'],
                                            folder_id, user)
            cjson_file_id = cjson_file['_id']
            cml_file = self._generate_file(input, 'xyz', 'cml',
                                           '%s.cml' % file['name'],
                                           folder_id, user)
            cml_file_id = cml_file['_id']

            with self.model('file').open(cjson_file) as fp:
                cjson = json.loads(fp.read().decode())

            updates.setdefault('$set', {
                'cjsonFileId': cjson_file_id,
                'cmlFileId': cml_file_id,
                'xyzFileId': xyz_file_id,
                'cjson': cjson
            })

            # Save the old file ids, so we can delete them
            for file_id_key in ['cjsonFileId', 'cmlFileId', 'xyzFileId']:
                if file_id_key in structure:
                    files_to_delete.append(structure[file_id_key])

        if updates:
            super(Structure, self).update(query, update=updates, multi=False)

            # Now delete the old files
            for file_id in files_to_delete:
                f = File().load(structure[file_id], force=True)
                item =  Item().load(f['itemId'], force=True)
                Item().remove(item)

            return self.load(structure['_id'], user=user, level=AccessType.READ)

        return structure

    def delete(self, structure, user):

        for file_id in ['cjsonFileId', 'xyzFileId', 'cmlFileId']:
            if file_id in structure:
                f = File().load(structure[file_id], force=True)
                item =  Item().load(f['itemId'], force=True)
                Item().remove(item)

        super(Structure, self).remove(structure)

