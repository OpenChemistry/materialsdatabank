import re
from bson.objectid import ObjectId, InvalidId
import datetime

from girder.models.model_base import AccessControlledModel
from girder.constants import AccessType
from girder.models.model_base import ValidationException
from girder.models.group import Group
from girder.models.item import Item
from girder.models.file import File
from girder import events

from girder.plugins.materialsdatabank.models.slug import Slug, SlugUpdateException
from girder.plugins.materialsdatabank.models.reconstruction import Reconstruction as ReconstructionModel
from girder.plugins.materialsdatabank.models.structure import Structure as StructureModel
from girder.plugins.materialsdatabank.models.projection import Projection as ProjectionModel

from ..constants import ELEMENT_SYMBOLS_LOWER, ELEMENT_SYMBOLS


class Dataset(AccessControlledModel):

    def initialize(self):
        self.name = 'mdb.datasets'
        self.ensureIndices(('authors', 'title', 'atomicSpecies', 'mdbId'))
        self.ensureTextIndex({
            'authors': 1,
            'title': 1
        })

        self.exposeFields(level=AccessType.READ, fields=(
            '_id', 'authors', 'title', 'atomicSpecies', 'doi', 'mdbId'))


    def validate(self, dataset):
        if 'mdbId' in dataset and dataset['mdbId'] is not None:
            # Do we already have it
            if len(list(self.find(mdb_id=dataset['mdbId'], force=True))) > 0:
                raise ValidationException('"%s" has already been taken.' % dataset['mdbId'], field='mdbId')

        return dataset

    def _generate_mdb_id_prefix(self, species):
        prefix = []

        def _chars_left():
            return 4 - sum([len(x) for x in prefix])

        for s in species:
            if len(s) <= _chars_left():
                prefix.append(s)

        prefix += ['X'] * _chars_left()

        return ''.join(prefix)

    def _generate_mdb_id_postfix(self, prefix):
        # Search for existing datasets with this prefix
        regex = re.compile('^%s(\d{5})' % prefix)
        query = {
            'mdbId': {
                '$regex': regex
            }
        }

        cursor = super(Dataset, self).find(query, fields=['mdbId'])
        postfix = 0
        for d in cursor:
            match = regex.match(d['mdbId'])
            p = int(match.group(1))
            if  p > postfix:
                postfix = p

        postfix += 1

        return str(postfix).zfill(5)

    def ensure_mdb_id(self, dataset, species, updates):
        species = [ELEMENT_SYMBOLS[n] for n in species]

        if 'mbdId' not in dataset:
            prefix = self._generate_mdb_id_prefix(species)

            # Try up to 5 times, in case we have overlapping updates
            retry_count = 5
            while True:
                postfix = self._generate_mdb_id_postfix(prefix)
                mdb_id = '%s%s' % (prefix, postfix)
                # Now update atomically the slugs document
                try:
                    Slug().add(mdb_id)
                    break
                except SlugUpdateException:
                    if retry_count == 0:
                        raise Exception('Unable to create new mdb id after 5 retries.')
                    retry_count -= 1

            # Now we have allocated the mdbId add it to the dataset model
            updates.setdefault('$set', {})['mdbId'] = mdb_id


    def create(self, authors, title=None, doi=None, microscope=None, image_file_id=None,
               user=None, public=False):

        dataset = {
            'authors': authors,
            'title': title,
            'doi': doi,
            'editable': False,
            'deposited': datetime.datetime.utcnow()
        }

        if image_file_id is not None:
            dataset['imageFileId'] = ObjectId(image_file_id)

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

        dataset = self.save(dataset)

        events.trigger('mdb.dataset.created', {
                        'dataset': dataset,
                        'user': user
                    })

        return dataset

    def update(self, dataset, dataset_updates=None, user=None, atomic_species=None, validation=None,
               public=None):
        query = {
            '_id': dataset['_id']
        }

        if dataset_updates is None:
            dataset_updates = {}

        updates = {}

        mutable_props = ['authors', 'title', 'doi', 'editable']
        for prop in dataset_updates:
            if prop in mutable_props:
                updates.setdefault('$set', {})[prop] = dataset_updates[prop]

        if 'imageFileId' in dataset_updates:
            updates.setdefault('$set', {})['imageFileId'] = ObjectId(dataset_updates['imageFileId'])

        if atomic_species is not None:
            new_atomic_species = set(dataset.get('atomicSpecies', {}))
            new_atomic_species.update(atomic_species)
            if atomic_species is not None:
                updates.setdefault('$set', {})['atomicSpecies'] = list(new_atomic_species)
            self.ensure_mdb_id(dataset, new_atomic_species, updates)

        if public is not None:
            updates.setdefault('$set', {})['public'] = public
            # Trigger event if this dataset is being approved ( being made public )
            if public and not dataset.get('public', False):
                events.trigger('mdb.dataset.approved', {
                    'dataset': dataset,
                    'approver': user
                })
                updates.setdefault('$set', {})['released'] = datetime.datetime.utcnow()

        if validation is not None:
            updates.setdefault('$set', {})['validation'] = validation

        if updates:
            image_file_id = dataset['imageFileId']
            super(Dataset, self).update(query, update=updates, multi=False)
            # We need to remove the old image if we have added a new one
            if 'imageFileId' in dataset_updates and \
                dataset_updates['imageFileId'] != dataset['imageFileId']:
                image_file = File().load(image_file_id, force=True)
                item =  Item().load(image_file['itemId'], force=True)
                Item().remove(item)

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

                filters.append({
                    'mdbId': search
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

    def find(self, authors=None, title=None, atomic_species=None, mdb_id=None,
             owner=None, offset=0, limit=None, sort=None, user=None, force=False):
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

        if mdb_id is not None:
            query['mdbId'] = mdb_id

        if owner is not None:
            if not isinstance(owner, ObjectId):
                try:
                    owner = ObjectId(owner)
                except InvalidId:
                    raise ValidationException('Invalid ObjectId: %s' % owner,
                                              field='owner')
            query['userId'] = owner

        cursor = super(Dataset, self).find(query=query, sort=sort, user=user)

        if not force:
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
            # Try it as a mdb id
            dataset = list(self.find(mdb_id=id, limit=1, user=user))
            print(dataset)
            if len(dataset) > 0:
                return dataset[0]

        return None

    def delete(self, dataset, user):
        dataset_id = dataset['_id']
        # Delete reconstruction
        try:
            reconstruction = ReconstructionModel().find(dataset_id).next()
            ReconstructionModel().delete(reconstruction, user)
        except StopIteration:
            pass

        # Delete structure
        try:
            structure = StructureModel().find(dataset_id).next()
            StructureModel().delete(structure, user)
        except StopIteration:
            pass

        # Delete projection
        try:
            projection = ProjectionModel().find(dataset_id).next()
            ProjectionModel().delete(projection, user)
        except StopIteration:
            pass

        # Remove the slug
        Slug().remove(dataset['mdbId'])

        # Remove the image file
        image_file = File().load(dataset['imageFileId'], force=True)
        if image_file is not None:
            item =  Item().load(image_file['itemId'], force=True)
            Item().remove(item)

        # Now delete the dataset
        super(Dataset, self).remove(dataset)

