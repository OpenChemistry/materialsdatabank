from setuptools import setup

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

        'Intended Audience :: ',
        'Topic :: Software Development :: ',

        'License :: OSI Approved :: BSD 3-Clause',

        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
    ],

    keywords='',

    packages=['mdb'],

    install_requires=[
        'girder_client>=2.3.0',
        'click',
        'jsonpath-rw',
        'bibtexparser'
    ],
    entry_points='''
        [console_scripts]
        mdb=mdb:cli
    ''',

    extras_require={

    }
)
