FROM girder/girder:py3

# Enable proxy support
COPY ./devops/docker/girder/girder.local.conf /girder/girder/conf/girder.local.cfg

COPY ./server/materialsdatabank /materialsdatabank

# Install mongochemserver plugin
RUN girder-install plugin /materialsdatabank

