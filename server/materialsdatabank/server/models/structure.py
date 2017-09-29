import json
from jsonpath_rw import parse

from girder.models.model_base import ValidationException
from girder.constants import AccessType

from .base import BaseAccessControlledModel


class Structure(BaseAccessControlledModel):

    def initialize(self):
        self.name = 'structures'
        self.ensureIndices(['tomoId'])

    def validate(self, structure):
        return structure

    def create(self, tomo, file_id, user=None, public=None):
        structure = {
            'tomoId': tomo['_id'],
            'fileId': file_id
        }

        file = self.model('file').load(file_id, user=user)
        with self.model('file').open(file) as fp:
            cjson = json.loads(fp.read().decode())

        path = 'atoms.elements.number'
        species = parse(path).find(cjson)
        if species:
            species = species[0].value
        else:
            raise ValidationException('%s doesn\'t exist.' % path)

        species = species
        structure['atomicSpecies'] = species
        structure['cjson'] = cjson

        # Update the species at the tomo level
        self.model('tomo', 'materialsdatabank').update(tomo, species)


        self.setPublic(structure, public=public)

        if user:
            structure['userId'] = user['_id']
            self.setUserAccess(structure, user=user, level=AccessType.ADMIN)
        else:
            structure['userId'] = None

        return self.save(structure)

