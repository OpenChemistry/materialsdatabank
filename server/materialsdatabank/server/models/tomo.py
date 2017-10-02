from girder.models.model_base import AccessControlledModel
from girder.constants import AccessType
from ..constants import ELEMENT_SYMBOLS_LOWER

class Tomo(AccessControlledModel):

    def initialize(self):
        self.name = 'tomos'
        self.ensureIndices(('authors', 'paper', 'atomicSpecies'))
        self.ensureTextIndex({
            'authors': 1,
            'paper': 1
        })

        self.exposeFields(level=AccessType.READ, fields=(
            '_id', 'authors', 'paper', 'atomicSpecies'))


    def validate(self, tomo):
        return tomo

    def create(self, authors, paper=None, microscope=None, image_file_id=None,
                   user=None, public=True):

        tomo = {
            'authors': authors,
            'paper': paper
        }

        if image_file_id is not None:
            tomo['imageFileId'] = image_file_id

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

    def search(self, search_terms=None, atomic_species=None, offset=0, limit=None,
               sort=None, user=None):
        query = {}
        if search_terms is not None:
            filters = []

            for search in search_terms:
                filters.append({
                    '$text': {
                        '$search': search
                        }
                })

                try:
                    # Try looking up element
                    try:
                        atomic_number = ELEMENT_SYMBOLS_LOWER.index(search)
                    except ValueError:
                        # Try convert to int
                        atomic_number = int(search)

                    filters.append({
                        'atomicSpecies': {
                            '$in': [atomic_number]
                        }
                    })
                except ValueError:
                    # The search term can't be an atomic number
                    pass

            query['$or'] = filters

        cursor = super(Tomo, self).find(query=query, offset=offset, limit=limit,
                                        timeout=None, sort=sort, user=user)

        for r in self.filterResultsByPermission(cursor=cursor, user=user,
                                                level=AccessType.READ,
                                                limit=limit, offset=offset):
            yield r
