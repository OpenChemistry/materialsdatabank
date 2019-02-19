FROM girder/girder:2.x-maintenance-py3

# Enable proxy support
COPY ./devops/docker/girder/girder.local.conf /girder/girder/conf/girder.local.cfg

COPY . /materialsdatabank

RUN pip install -e /materialsdatabank

# Install materialdatabank plugin
RUN girder-install plugin /materialsdatabank/server/materialsdatabank

