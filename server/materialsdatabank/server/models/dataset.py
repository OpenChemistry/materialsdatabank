import re

from girder.models.model_base import AccessControlledModel
from girder.constants import AccessType
from ..constants import ELEMENT_SYMBOLS_LOWER


class Dataset(AccessControlledModel):

    def initialize(self):
        self.name = 'datasets'
        self.ensureIndices(('authors', 'title', 'atomicSpecies'))
        self.ensureTextIndex({
            'authors': 1,
            'title': 1
        })

        self.exposeFields(level=AccessType.READ, fields=(
            '_id', 'authors', 'title', 'atomicSpecies', 'url'))


    def validate(self, dataset):
        return dataset

    def create(self, authors, title=None, url=None, microscope=None, image_file_id=None,
                   user=None, public=True):

        dataset = {
            'authors': authors,
            'title': title,
            'url': url
        }

        if image_file_id is not None:
            dataset['imageFileId'] = image_file_id

        self.setPublic(dataset, public=public)

        if user:
            dataset['userId'] = user['_id']
            self.setUserAccess(dataset, user=user, level=AccessType.ADMIN)
        else:
            dataset['userId'] = None

        return self.save(dataset)

    def update(self, dataset, atomic_species=None):
        query = {
            '_id': dataset['_id']
        }
        updates = {}

        new_atomic_species = set(dataset.get('atomicSpecies', {}))
        new_atomic_species.update(atomic_species)
        if atomic_species is not None:
            updates.setdefault('$set', {})['atomicSpecies'] = list(new_atomic_species)

        if updates:
            super(Dataset, self).update(query, update=updates, multi=False)


    def _normalize_element(self, element):
        # Try looking up element
        try:
            atomic_number = ELEMENT_SYMBOLS_LOWER.index(element.lower())
        except ValueError:
            # Try convert to int
            atomic_number = int(element)

        return atomic_number

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
                    atomic_number = self._normalize_element(search)

                    filters.append({
                        'atomicSpecies': {
                            '$in': [atomic_number]
                        }
                    })
                except ValueError:
                    # The search term can't be an atomic number
                    pass

            query['$or'] = filters

        cursor = super(Dataset, self).find(query=query, sort=sort, user=user)

        for r in self.filterResultsByPermission(cursor=cursor, user=user,
                                                level=AccessType.READ,
                                                limit=limit, offset=offset):
            yield r

    def find(self, authors=None, title=None, atomic_species=None, offset=0, limit=None,
             sort=None, user=None):
        query = {}

        if authors is not None:
            if not isinstance(authors, (list, tuple)):
                authors = [authors]

            author_regexs = []
            for author in authors:
                author_regexs.append(re.compile('.*%s.*' % author, re.IGNORECASE))

            query['authors'] = {
                '$in': author_regexs
            }

        if title is not None:
            regex = re.compile('.*%s.*' % title, re.IGNORECASE)
            query['title'] = {
                '$regex': regex
            }


        if atomic_species:
            species = []

            for s in atomic_species:
                try:
                    atomic_number = self._normalize_element(s)
                    species.append(atomic_number)
                except ValueError:
                    # The search term can't be an atomic number
                    pass

            query['atomicSpecies'] = {
                '$in': species
            }

        cursor = super(Dataset, self).find(query=query, sort=sort, user=user)

        for r in self.filterResultsByPermission(cursor=cursor, user=user,
                                                level=AccessType.READ,
                                                limit=limit, offset=offset):
            yield r
