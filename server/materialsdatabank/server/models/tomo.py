from girder.models.model_base import AccessControlledModel
from girder.constants import AccessType

class Tomo(AccessControlledModel):

    def initialize(self):
        self.name = 'tomos'
        self.ensureIndices(['structureId', 'projectionId', 'reconstructionId',
                            'authors', 'paper'])


    def validate(self, tomo):
        return tomo

    def create(self, authors, paper=None, microscope=None,
                   user=None, public=True):

        tomo = {
            'authors': authors,
            'paper': paper
        }

        self.setPublic(tomo, public=public)

        if user:
            tomo['userId'] = user['_id']
            self.setUserAccess(tomo, user=user, level=AccessType.ADMIN)
        else:
            tomo['userId'] = None

        return self.save(tomo)

    def update(self, tomo, atomic_species=None):
        query = {
            '_id': tomo['_id']
        }
        updates = {}

        new_atomic_species = set(tomo.get('atomicSpecies', {}))
        new_atomic_species.update(atomic_species)
        if atomic_species is not None:
            updates.setdefault('$set', {})['atomicSpecies'] = list(new_atomic_species)

        if updates:
            super(Tomo, self).update(query, update=updates, multi=False)
