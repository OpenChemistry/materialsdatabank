import sys
import click
import types
import bibtexparser
from girder_client import GirderClient
import six
import numpy as np
import scipy.io as spio
from .r1 import calculate_r1_factor
from .utility import xyz_to_numpy, proj_to_numpy, json_to_reconstruction_params
from periodictable import elements
import h5py as h5

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

@cli.command('deposit', help='Upload data set to materials data bank.')
@click.option('-b', '--bibtex-file', default=None,
              help='path to bibtex file for paper',
              required=True,
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('-r', '--recon-file', default=None,
              help='path to the EMD file containing the reconstruction',
              type=click.Path(exists=True, dir_okay=False, readable=True),
              required=True)
@click.option('-p', '--proj-file', default=None,
              help='path to the EMD file containing the projection',
              type=click.Path(exists=True, dir_okay=False, readable=True),
              required=True)
@click.option('-s', '--xyz-file', default=None,
              help='path to the XYZ file containing structure',
              type=click.Path(exists=True, dir_okay=False, readable=True),
              required=True)
@click.option('-i', '--image-file', default=None,
              help='path to an image to display with document',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('-u', '--url', default=None,
              help='the url for the dataset', type=str)
@click.option('-g', '--slug', default=None,
              help='the url slug', type=str)
@click.option('-a', '--api-url', default=None,
              help='RESTful API URL '
                   '(e.g https://girder.example.com:443/%s)' % GirderClient.DEFAULT_API_ROOT)
@click.option('-k', '--api-key', envvar='GIRDER_API_KEY', default=None,
              help='[default: GIRDER_API_KEY env. variable]')
@click.option('-j', '--json-file', default=None,
              help='path to the json file containing the reconstruction parameters',
              type=click.File('r'), required=True)
@click.option('-n', '--username', default=None)
@click.option('-w', '--password', default=None)
@click.pass_obj
def _deposit(ctx, username, password, api_key, api_url, bibtex_file=None,
            recon_file=None, proj_file=None, xyz_file=None, image_file=None,
            url=None, slug=None, json_file=None):
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
    recon_file = gc.uploadFileToFolder(folder['_id'], recon_file)
    (resolution, crop_half_width, volume_size,
    z_direction, b_factor, h_factor, axis_convention) = json_to_reconstruction_params(json_file)
    recon = {
        'emdFileId': recon_file['_id'],
        'resolution': resolution,
        'cropHalfWidth': crop_half_width,
        'volumeSize': volume_size,
        'zDirection': z_direction,
        'bFactor': b_factor,
        'hFactor': h_factor,
        'axisConvention': axis_convention
    }

    click.echo('Creating reconstruction ...')
    gc.post('mdb/datasets/%s/reconstructions' % dataset['_id'], json=recon)

    # Upload projection
    proj_file = gc.uploadFileToFolder(folder['_id'], proj_file)
    proj = {
        'emdFileId': proj_file['_id']
    }

    click.echo('Creating projection ...')
    gc.post('mdb/datasets/%s/projections' % dataset['_id'], json=proj)

    # Upload structure
    xyz_file = gc.uploadFileToFolder(folder['_id'], xyz_file)
    struc = {
        'xyzFileId': xyz_file['_id']
    }

    click.echo('Creating structure ...')
    gc.post('mdb/datasets/%s/structures' % dataset['_id'], json=struc)


@cli.command('r1', help='Calculate R1 factor.')
@click.option('-p', '--proj-file', default=None,
              help='path to the EMD file containing the experimentally measured projections',
              type=click.Path(exists=True, dir_okay=False, readable=True), required=True)
@click.option('-s', '--struc-file', default=None,
              help='path to the XYZ file containing the atomic structure',
              type=click.File('r'), required=True)
@click.option('-j', '--json-file', default=None,
              help='path to the json file containing the reconstruction parameters',
              type=click.File('r'), required=True)
def _r1(proj_file, struc_file, json_file):

    (currProjs, currAngles) = proj_to_numpy(proj_file)
    (currPos, currAtom, AtomicNumbers) = xyz_to_numpy(struc_file)
    (resolution, crop_half_width, volume_size,
    z_direction, b_factor, h_factor, axis_convention) = json_to_reconstruction_params(json_file)

    r1 = calculate_r1_factor(currProjs, currAngles, currPos, currAtom, AtomicNumbers,
                             resolution, crop_half_width, volume_size,
                             z_direction, b_factor, h_factor, axis_convention)

    click.echo('R1 factor: %s' % r1)


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
        xyz += '%s %s %s %s\n' % (symbol, positions[0][i], positions[1][i],
            positions[2][i])

    if xyz_file is None:
        click.echo(xyz)
    else:
        xyz_file.write(xyz)

def _emd_proj(proj, proj_angles, emd_file):
    with h5.File(emd_file, "w") as f:
        f.attrs.create('version_major', 0, dtype = np.int32)
        f.attrs.create('version_minor', 2, dtype = np.int32)

        data = f.create_group('data')
        tomo = data.create_group('tomography')
        tomo.attrs.create('emd_group_type', 1, dtype = np.int32)
        tomo.create_dataset('data', data = proj.astype(np.float64))

        dim1 = tomo.create_dataset('dim1', (proj.shape[0],1), dtype=np.int)
        dim1[:,0] = np.array(range(proj.shape[0]))
        dim1.attrs['name'] = np.string_('x')
        dim1.attrs['units'] = np.string_('[px]')

        dim2 = tomo.create_dataset('dim2', (proj.shape[1],1), dtype=np.int)
        dim2[:,0] = np.array(range(proj.shape[1]))
        dim2.attrs['name'] = np.string_('y')
        dim2.attrs['units'] = np.string_('[px]')

        dim3 = tomo.create_dataset('dim3', proj_angles.shape, dtype=np.float64)
        dim3[:] = proj_angles
        dim3.attrs['name'] = np.string_('angle')
        dim3.attrs['units'] = np.string_('[deg]')

def _emd_recon(recon, emd_file):
    with h5.File(emd_file, "w") as f:
        f.attrs.create('version_major', 0, dtype = np.uint32)
        f.attrs.create('version_minor', 2, dtype = np.uint32)

        data = f.create_group('data')
        tomo = data.create_group('tomography')
        tomo.attrs.create('emd_group_type', 1, dtype = np.uint32)
        tomo.create_dataset('data', data = recon.astype(np.float64))

        dim1 = tomo.create_dataset('dim1', (recon.shape[0],1), dtype=np.float32)
        dim1[:,0] = np.array(recon.shape[0])
        dim1.attrs['name'] = np.string_('x')
        dim1.attrs['units'] = np.string_('[px]')

        dim2 = tomo.create_dataset('dim2', (recon.shape[1],1), dtype=np.float32)
        dim2[:,0] = np.array(recon.shape[1])
        dim2.attrs['name'] = np.string_('y')
        dim2.attrs['units'] = np.string_('[px]')

        dim3 = tomo.create_dataset('dim3', (recon.shape[2],1), dtype=np.float32)
        dim3[:,0] = np.array(recon.shape[2])
        dim3.attrs['name'] = np.string_('z')
        dim2.attrs['units'] = np.string_('[px]')

@cli.command('emd', help='Convert projection or reconstruction from MatLab to EMD.')
@click.option('-p', '--proj-file', default=None,
              help='path to the MatLab file containing the experimentally measured projections',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('-a', '--proj-angles-file', default=None,
              help='path to the MatLab file containing the experimentally measured projection angles',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('-r', '--recon-file', default=None,
              help='path to the MatLab file containing the reconstruction',
              type=click.Path(exists=True, dir_okay=False, readable=True))
@click.option('-o', '--emd-file', help='path to write the EMD data to',
              type=click.Path(dir_okay=False, writable=True), required=True)
@click.pass_context
def _emd(cxt, proj_file, proj_angles_file, recon_file, emd_file):
    # Projection
    if proj_file is not None:
        proj = _extract_data(spio.loadmat(proj_file))
        if proj_angles_file is None:
            raise click.UsageError('Projection angles must be provided: -a, --proj-angles-file')

        if recon_file is not None:
            raise click.UsageError('-r, --recon-file is not compatible with -p, --proj-file')
        proj_angles = _extract_data(spio.loadmat(proj_angles_file))

        _emd_proj(proj, proj_angles, emd_file)
    # Reconstruction
    elif recon_file is not None:
        if proj_file is not None or proj_angles_file is not None:
            raise click.UsageError('-p, --proj-file and -a, --proj-angles compatible with -r, --recon-file')
        recon = _extract_data(spio.loadmat(recon_file))
        _emd_recon(recon, emd_file)
    else:
        click.echo(cxt.get_help())

