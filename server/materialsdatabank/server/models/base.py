from girder.models.model_base import AccessControlledModel
from girder.models.model_base import ValidationException


class BaseAccessControlledModel(AccessControlledModel):
    types = {}

    def find(self, dataset_id, offset=0, limit=0, timeout=None,
             fields=None, sort=None):

        query = {
            'datasetId': dataset_id
        }

        return super(BaseAccessControlledModel, self).find(query, offset, limit,
                                                           timeout, fields, sort)
    def validate_list(self, value, func):
        if not isinstance(value, list):
            raise ValidationException('Invalid value for list type')

        return [func(x) for x in value]

    def validate(self, doc):
        for k in doc.keys():
            if k in self.types:
                doc[k] = self.types[k](doc[k])

        return doc
