import sys
import click
import types
import bibtexparser
from girder_client import GirderClient
import six
import numpy as np
import scipy.io as spio
from .r1 import calculate_r1_factor
from periodictable import elements


class MDBCli(GirderClient):

    def __init__(self, username, password, api_url=None, api_key=None):

        def _progress_bar(*args, **kwargs):
            bar = click.progressbar(*args, **kwargs)
            bar.bar_template = "[%(bar)s]  %(info)s  %(label)s"
            bar.show_percent = True
            bar.show_pos = True

            def formatSize(length):
                if length == 0:
                    return '%.2f' % length
                unit = ''
                # See https://en.wikipedia.org/wiki/Binary_prefix
                units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
                while True:
                    if length <= 1024 or len(units) == 0:
                        break
                    unit = units.pop(0)
                    length /= 1024.
                return '%.2f%s' % (length, unit)

            def formatPos(_self):
                pos = formatSize(_self.pos)
                if _self.length_known:
                    pos += '/%s' % formatSize(_self.length)
                return pos

            bar.format_pos = types.MethodType(formatPos, bar)
            return bar

        _progress_bar.reportProgress = sys.stdout.isatty()

        super(MDBCli, self).__init__(
            apiUrl=api_url, progressReporterCls=_progress_bar)
        interactive = password is None

        if api_key:
            self.authenticate(apiKey=api_key)
        elif username:
            self.authenticate(username, password, interactive=interactive)


@click.group()
def cli():
    pass

@cli.command('import', help='Import document.')
@click.option('--bibtex-file', default=None,
              help='path to bibtex file for paper',
              required=True,
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('--emd-file', default=None,
              help='path to emd file containing the reconstruction',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('--tiff-file', default=None,
              help='path to tiff file containing the reconstruction',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('--cjson-file', default=None,
              help='path to cjson file containing structure',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('--xyz-file', default=None,
              help='path to xyz file containing structure',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('--cml-file', default=None,
              help='path to cml file containing structure',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('--image-file', default=None,
              help='path to an image to display with document',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('--url', default=None,
              help='the url for the dataset', type=str)
@click.option('--slug', default=None,
              help='the url slug', type=str)
@click.option('--api-url', default=None,
              help='RESTful API URL '
                   '(e.g https://girder.example.com:443/%s)' % GirderClient.DEFAULT_API_ROOT)
@click.option('--api-key', envvar='GIRDER_API_KEY', default=None,
              help='[default: GIRDER_API_KEY env. variable]')
@click.option('--username', default=None)
@click.option('--password', default=None)
@click.pass_obj
def _import(ctx, username, password, api_key, api_url, bibtex_file=None,
            emd_file=None, tiff_file=None, cjson_file=None, xyz_file=None,
            cml_file=None, image_file=None, url=None, slug=None):
    with open(bibtex_file) as bibtex_file:
        bibtex_database = bibtexparser.load(bibtex_file)
        entry = bibtex_database.entries[0]
        authors = entry['author'].split(' and ')
        if 'others' in authors:
            authors.remove('others')
        title = entry['title']

    gc = MDBCli(username, password, api_url=api_url, api_key=api_key)

    me = gc.get('/user/me')
    private_folder = next(gc.listFolder(me['_id'], 'user', 'Private'))

    folder = gc.listFolder(private_folder['_id'], 'folder', name='mdb')
    try:
        folder = six.next(folder)
    except StopIteration:
        folder = gc.createFolder(private_folder['_id'], 'mdb', parentType='folder',
                                 public=False)

    if image_file is not None:
        image_file = gc.uploadFileToFolder(folder['_id'], image_file)

    dataset = {
        'authors': authors,
        'title': title,
        'url': url,
        'slug': slug
    }

    if image_file is not None:
        dataset['imageFileId'] = image_file['_id']

    dataset = gc.post('mdb/datasets', json=dataset)

    # Upload reconstructions
    emd_file = gc.uploadFileToFolder(folder['_id'], emd_file)
    tiff_file = gc.uploadFileToFolder(folder['_id'], tiff_file)
    print('Creating reconstruction ...')
    recon  = {
        'emdFileId': emd_file['_id'],
        'tiffFileId': tiff_file['_id']
    }

    gc.post('mdb/datasets/%s/reconstructions' % dataset['_id'], json=recon)

    # Upload structure
    cjson_file = gc.uploadFileToFolder(folder['_id'], cjson_file)
    xyz_file = gc.uploadFileToFolder(folder['_id'], xyz_file)
    cml_file = gc.uploadFileToFolder(folder['_id'], cml_file)
    print('Creating structure ...')
    struc  = {
        'cjsonFileId': cjson_file['_id'],
        'xyzFileId': xyz_file['_id'],
        'cmlFileId': cml_file['_id']
    }

    gc.post('mdb/datasets/%s/structures' % dataset['_id'], json=struc)


@cli.command('r1', help='Calculate R1 factor.')
@click.option('-p', '--proj-file', default=None,
              help='path to experimentally measured projections',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('-a', '--proj-angles-file', default=None,
              help='path experimentally measured projection angles',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('-s', '--struc-file', default=None,
              help='path to file containing the atomic structure',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('-t', '--atomic-spec-file', default=None,
              help='path to file containing atomic species',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('-n', '--atomic-numbers-file', default=None,
              help='path to file containing atomic number of the species',
              type=click.File('r'))
def _r1(proj_file, proj_angles_file,  struc_file, atomic_spec_file, atomic_numbers_file):
    currPos = spio.loadmat(struc_file)
    currAtom = spio.loadmat(atomic_spec_file)
    currProjs = spio.loadmat(proj_file)
    currAngles =spio.loadmat(proj_angles_file)

    currPos = currPos['currModel']
    currAtom = currAtom['currAtom'] - 1
    currProjs = currProjs['currProjection']
    currAngles =currAngles['currAngle']

    AtomicNumbers = np.array([int(x) for x in atomic_numbers_file.read().split(',')])

    r1 = calculate_r1_factor(currProjs, currAngles, currPos, currAtom, AtomicNumbers)

    print('R1 factor: %s' % r1)


def _extract_key(mat_dict):
    keys = mat_dict.keys()
    # filter out __XXX
    keys = [k for k in keys if not k.startswith('__')]

    if len(keys) != 1:
        raise Exception('Unable to extract single key from: %d' % mat_dict.keys())

    return keys[0]

def _extract_data(mat_dict):
    key = _extract_key(mat_dict)

    return mat_dict[key]

NUMBER_TO_SYMBOL =  {el.number: el.symbol for el in elements}

@cli.command('xyz', help='Convert structure from MatLab to XYZ.')
@click.option('-s', '--struc-file', default=None,
              help='path to MatLab file containing the atomic structure',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('-t', '--atomic-spec-file', default=None,
              help='path to MatLab file containing atomic species',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('-n', '--atomic-numbers-file', default=None,
              help='path to CSV file containing the atomic numbers of the species',
              type=click.File('r'))
@click.option('-o', '--xyz-file', help='path to write the XYZ data to',
              type=click.File('w'))
def _xyz(struc_file, atomic_spec_file, atomic_numbers_file, xyz_file):
    positions = _extract_data(spio.loadmat(struc_file))
    atomic_species = _extract_data(spio.loadmat(atomic_spec_file))
    atomic_species = atomic_species - 1
    atomic_numbers = [int(x) for x in atomic_numbers_file.read().split(',')]

    (_, number_of_atoms) = atomic_species.shape

    xyz = '%s\n\n' % number_of_atoms

    for i in range(0, number_of_atoms):
        atomic_number = atomic_numbers[atomic_species[0][i]]
        symbol = NUMBER_TO_SYMBOL[atomic_number]
        xyz += '%s %f %f %f\n' % (symbol, positions[0][i], positions[1][i],
            positions[2][i])

    if xyz_file is None:
        click.echo(xyz)
    else:
        xyz_file.write(xyz)




