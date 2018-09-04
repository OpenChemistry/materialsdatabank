from girder.models.model_base import Model
from girder.constants import AccessType
from girder.models.group import Group

class SlugUpdateException(Exception):
    pass

class Slug(Model):
    """
    Singleton model used to hold a list of the slugs used by datasets. This
    allows use to atomically allocate slugs. By having a single document we
    can make use of mongodb's single document update atomicity.
    """
    def __init__(self):
        super(Slug, self).__init__()

        # Ensure we have our singleton document
        self._singleton = self.findOne()
        if self._singleton is None:
            self._singleton = self.create()

    def initialize(self):
        self.name = 'mdb.slugs'
        self.ensureIndices(['slug'])

    def validate(self, slug):
        return slug

    def create(self):
        slug = {
            'slugs': []

        }

        return self.save(slug)

    def add(self, slug):
        query = {
            '_id': self._singleton['_id'],
            'slugs': {
                '$ne': slug
            }
        }

        update = {
            '$addToSet': {
                'slugs': slug
            }
        }

        update_result = self.update(query, update)

        if update_result.modified_count != 1:
            raise SlugUpdateException()

