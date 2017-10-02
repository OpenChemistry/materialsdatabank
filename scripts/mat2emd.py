import numpy as np
import h5py as h5
import scipy.io as spio
import argparse

def import_matlab(inputName, outputName):
    w = spio.loadmat(inputName)
    a = w['Rdenoisen']

    f = h5.File(outputName, "w")
    f.attrs.create('version_major', 0, dtype = np.int32)
    f.attrs.create('version_minor', 2, dtype = np.int32)

    data = f.create_group('data')
    tomo = data.create_group('tomography')
    tomo.attrs.create('emd_group_type', 1, dtype = np.int32)

    # Rescale the array, and then convert to a smaller type.
    minimum = np.amin(a)
    maximum = np.amax(a)
    a = a - minimum
    a = (255.0 / (maximum - minimum)) * a
    tomo.create_dataset('data', data = a.astype(np.uint8))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Translate MatLab files')
    parser.add_argument('-i', help='Input MatLab file', required=True)
    parser.add_argument('-o', help='Output HDF5 file', required=True)
    args = parser.parse_args()

    import_matlab(args.i, args.o)
