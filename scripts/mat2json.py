import numpy as np
import json
import scipy.io as spio
import argparse

def import_matlab(inputName, outputName):
    w = spio.loadmat(inputName)
    a = w['PosW']
    #a = np.resize(w['PosW'], (w['PosW'].shape[0], 5))

    dic = {}
    dic['chemical json'] = 0
    dic['atoms'] = {}
    dic['atoms']['coords'] = {}
    dic['atoms']['coords']['3d'] = a.flatten('F').tolist()

    elements = np.full((1, a.shape[1]), 74)
    dic['atoms']['elements'] = {}
    dic['atoms']['elements']['number'] = elements.flatten().tolist()

    with open(outputName, 'w') as outfile:
        json.dump(dic, outfile)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Translate MatLab files')
    parser.add_argument('-i', help='Input MatLab file', required=True)
    parser.add_argument('-o', help='Output CJSON file', required=True)
    args = parser.parse_args()

    import_matlab(args.i, args.o)
