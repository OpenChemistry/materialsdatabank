from girder.api.rest import RestException
from girder.models.group import Group

def is_user_curator(user):
    is_curator = False

    curator_group = list(Group().find({
        'name': 'curator',
    }))

    if len(curator_group) > 0:
        groups = user['groups']

        if curator_group[0]['_id'] in groups:
            is_curator = True
    else:
        raise RestException('Unable to load group. Please check correct groups have been configured.')

    return is_curator
