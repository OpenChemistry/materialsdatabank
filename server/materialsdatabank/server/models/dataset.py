import re
from bson.objectid import ObjectId, InvalidId

from girder.models.model_base import AccessControlledModel
from girder.constants import AccessType
from girder.models.model_base import ValidationException
from girder.models.group import Group

from ..constants import ELEMENT_SYMBOLS_LOWER


class Dataset(AccessControlledModel):

    def initialize(self):
        self.name = 'mdb.datasets'
        self.ensureIndices(('authors', 'title', 'atomicSpecies', 'slug'))
        self.ensureTextIndex({
            'authors': 1,
            'title': 1
        })

        self.exposeFields(level=AccessType.READ, fields=(
            '_id', 'authors', 'title', 'atomicSpecies', 'url', 'slug'))


    def validate(self, dataset):
        if 'slug' in dataset and dataset['slug'] is not None:
            # Do we already have it
            if len(list(self.find(slug=dataset['slug'], force=True))) > 0:
                raise ValidationException('"%s" has already been taken.' % dataset['slug'], field='slug')

        return dataset

    def create(self, authors, title=None, url=None, microscope=None, image_file_id=None,
                   slug=None, user=None, public=False):

        dataset = {
            'authors': authors,
            'title': title,
            'url': url
        }

        if image_file_id is not None:
            dataset['imageFileId'] = image_file_id

        if slug is not None:
            dataset['slug'] = slug

        self.setPublic(dataset, public=public)

        if user:
            dataset['userId'] = user['_id']
            self.setUserAccess(dataset, user=user, level=AccessType.ADMIN)
            curator = list(Group().find({
                'name': 'curator',
            }))
            if len(curator) > 0:
                self.setGroupAccess(dataset, group=curator[0], level=AccessType.ADMIN)
        else:
            dataset['userId'] = None

        return self.save(dataset)

    def update(self, dataset, user=None, atomic_species=None, public=None):
        query = {
            '_id': dataset['_id']
        }
        updates = {}

        if atomic_species is not None:
            new_atomic_species = set(dataset.get('atomicSpecies', {}))
            new_atomic_species.update(atomic_species)
            if atomic_species is not None:
                updates.setdefault('$set', {})['atomicSpecies'] = list(new_atomic_species)

        if public is not None:
            updates.setdefault('$set', {})['public'] = public

        if updates:
            super(Dataset, self).update(query, update=updates, multi=False)
            return self.load(dataset['_id'], user=user, level=AccessType.READ)

        return dataset

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

    def find(self, authors=None, title=None, atomic_species=None, slug=None,
             offset=0, limit=None, sort=None, user=None, force=False):
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

        if slug is not None:
            query['slug'] = slug

        cursor = super(Dataset, self).find(query=query, sort=sort, user=user)

        if not force:
            print('not force')
            for r in self.filterResultsByPermission(cursor=cursor, user=user,
                                                    level=AccessType.READ,
                                                    limit=limit, offset=offset):
                yield r
        else:
            for r  in cursor:
                yield r

    def load(self, id, user=None, level=AccessType.READ, force=False):
        try:
            ObjectId(id)
            return super(Dataset, self).load(id, user=user, level=level, force=force)
        except InvalidId:
            # Try it as a slug
            dataset = list(self.find(slug=id, limit=1, user=user))
            print(dataset)
            if len(dataset) > 0:
                return dataset[0]

        return None

