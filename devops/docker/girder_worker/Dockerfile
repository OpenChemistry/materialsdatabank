FROM girder/girder_worker:latest-py3

USER root

COPY ./devops/docker/wait-for-it.sh /wait-for-it.sh

COPY ./materialsdatabank /materialsdatabank/materialsdatabank/
COPY ./setup.py /materialsdatabank/setup.py

RUN pip3 install /materialsdatabank/[worker]

RUN chown -R worker:worker /wait-for-it.sh

USER worker

ENV PYTHON_BIN=python3

ENTRYPOINT ["/wait-for-it.sh", "app-rabbit:5672", "--", "/docker-entrypoint.sh"]
