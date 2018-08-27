from setuptools import setup, find_packages

setup(
    name='materialsdatabank',

    version='0.0.1',

    description='An Information Portal for 3D atomic electron tomography data',
    long_description='An Information Portal for 3D atomic electron tomography data',

    url='https://github.com/OpenChemistry/materialdatabank',

    author='Kitware Inc',

    license='BSD 3-Clause',

    classifiers=[
        'Development Status :: 3 - Alpha',
        'License :: OSI Approved :: BSD License',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.5',
    ],

    keywords='',

    packages=find_packages(),
    extras_require={
        'worker': ['girder_worker', 'pillow']
    },
    install_requires=[
        'girder_client>=2.3.0',
        'click',
        'jsonpath-rw',
        'bibtexparser',
        'numpy',
        'scipy',
        'periodictable',
        'h5py'
    ],
    entry_points= {
        'girder_worker_plugins': [
              'mdb = materialsdatabank.girder_worker:MDBPlugin',
        ],
        'console_scripts': [
            'mdb=materialsdatabank:cli'
        ]
    }
)
