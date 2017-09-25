from girder.models.model_base import AccessControlledModel

class Tomo(AccessControlledModel):

    def initialize(self):
        self.name = 'tomo'

    def validate(self, tomo):
        return tomo

