FROM girder/girder:latest-py3

# Install cmake
RUN wget https://cmake.org/files/v3.10/cmake-3.10.0-rc2-Linux-x86_64.sh && \
  chmod u+x cmake-3.10.0-rc2-Linux-x86_64.sh && \
  mkdir /cmake && \
  ./cmake-3.10.0-rc2-Linux-x86_64.sh --skip-license --prefix=/cmake

# Build pybind11
RUN git clone https://github.com/pybind/pybind11.git /pybind11/source && \
  mkdir /pybind11/build && \
  mkdir /pybind11/install && \
  cd /pybind11/build && \
  /cmake/bin/cmake -DCMAKE_INSTALL_PREFIX:PATH=/pybind11/install -DPYBIND11_TEST:BOOL=NO ../source && \
  /cmake/bin/cmake --build . --target install && \
  rm -rf /pybind11/build && rm -rf /pybind11/source

# Install deps for avogadro
RUN apt-get update && apt-get -y install \
  libeigen3-dev \
  libpython3-dev

# Build avogadrolibs
RUN git clone https://github.com/openchemistry/avogadrolibs.git /avogadrolibs/source && \
  mkdir /avogadrolibs/build && \
  cd /avogadrolibs/build && \
  /cmake/bin/cmake -DCMAKE_BUILD_TYPE:STRING=Release -DUSE_PYTHON:BOOL=YES -DENABLE_TESTING:BOOL=NO \
    -Dpybind11_DIR:PATH=/pybind11/install/share/cmake/pybind11 -DUSE_SPGLIB:BOOL=NO \
    -DUSE_QT:BOOL=NO -DUSE_OPENGL:BOOL=NO -DUSE_MMTF:BOOL=NO ../source && \
  /cmake/bin/cmake --build . && \
  mkdir -p /usr/lib/python3.4/site-packages/ && \
  cp /avogadrolibs/build/lib/* /usr/local/lib/python3.5/dist-packages/ && \
  rm -rf /avogadrolibs/source

# Remove cmake
RUN rm -rf /cmake

# Enable proxy support
COPY ./devops/docker/girder/girder.local.conf /girder/girder/conf/girder.local.cfg

COPY . /materialsdatabank

RUN pip install -e /materialsdatabank

# Install materialdatabank plugin
RUN girder-install plugin /materialsdatabank/server/materialsdatabank

