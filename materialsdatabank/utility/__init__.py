import numpy as np
from periodictable import elements
import h5py as h5


SYMBOL_TO_NUMBER =  {el.symbol: el.number for el in elements}


def xyz_to_numpy(xyz_file):
    number_of_atoms = int(xyz_file.readline().strip())
    xyz_file.readline()

    elements = []
    positions = np.ndarray(shape=(3, number_of_atoms))

    for i, line in enumerate(xyz_file):
        (e, x, y, z) = line.split(' ')
        elements.append(e.strip())
        positions [0][i] = float(x.strip())
        positions [1][i] = float(y.strip())
        positions [2][i] = float(z.strip())

    i += 1
    if i != number_of_atoms:
        raise Exception('XYZ states that there are %s atom and there are only %s'
                            % (number_of_atoms, i))

    atomic_numbers = [SYMBOL_TO_NUMBER[e] for e in set(elements)]
    atomic_numbers.sort()
    atomic_spec = [atomic_numbers.index(SYMBOL_TO_NUMBER[e]) for e in elements]
    atomic_spec_np = np.ndarray(shape=(1, number_of_atoms), dtype=np.int)
    atomic_spec_np[0] = np.asarray(atomic_spec)

    return (positions, atomic_spec_np, atomic_numbers)

def recon_to_numpy(emd_file):
    with h5.File(emd_file, 'r') as f:
        emdgrp = f['data/tomography']
        data = emdgrp['data'][:]

    return data

def proj_to_numpy(emd_file):
    with h5.File(emd_file, 'r') as f:
        emdgrp = f['data/tomography']
        proj = emdgrp['data'][:]
        angle = emdgrp['dim3'][:]

    return (proj, angle)
