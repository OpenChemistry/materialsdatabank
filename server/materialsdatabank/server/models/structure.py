import json
from jsonpath_rw import parse

from girder.models.model_base import ValidationException
from girder.constants import AccessType

from .base import BaseAccessControlledModel


class Structure(BaseAccessControlledModel):

    def initialize(self):
        self.name = 'mdb.structures'
        self.ensureIndices(['datasetId'])

    def validate(self, structure):
        return structure

    def create(self, dataset, cjson_file_id, xyz_file_id, cml_file_id, user=None, public=None):
        structure = {
            'datasetId': dataset['_id'],
            'cjsonFileId': cjson_file_id,
            'xyzFileId': xyz_file_id,
            'cmlFileId': cml_file_id
        }

        file = self.model('file').load(cjson_file_id, user=user)
        with self.model('file').open(file) as fp:
            cjson = json.loads(fp.read().decode())

        path = 'atoms.elements.number'
        species = parse(path).find(cjson)
        if species:
            species = species[0].value
        else:
            raise ValidationException('%s doesn\'t exist.' % path)

        species = species
        structure['atomicSpecies'] = list(set(species))
        structure['cjson'] = cjson

        # Update the species at the dataset level
        self.model('dataset', 'materialsdatabank').update(dataset, species)


        self.setPublic(structure, public=public)

        if user:
            structure['userId'] = user['_id']
            self.setUserAccess(structure, user=user, level=AccessType.ADMIN)
        else:
            structure['userId'] = None

        return self.save(structure)

