from girder.models.model_base import AccessControlledModel


class BaseAccessControlledModel(AccessControlledModel):

    def find(self, dataset_id, offset=0, limit=0, timeout=None,
             fields=None, sort=None):

        query = {
            'datasetId': dataset_id
        }

        return super(BaseAccessControlledModel, self).find(query, offset, limit,
                                                           timeout, fields, sort)
