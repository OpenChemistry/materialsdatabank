import numpy as np
import json
import scipy.io as spio
import argparse

def import_matlab(inputName, inputTypes, outputName):
    f1 = spio.loadmat(inputName)
    f2 = spio.loadmat(inputTypes)
    a = f1['model']
    t = f2['atomtype']
    #a = np.resize(w['PosW'], (w['PosW'].shape[0], 5))

    dic = {}
    dic['chemical json'] = 0
    dic['atoms'] = {}
    dic['atoms']['coords'] = {}
    dic['atoms']['coords']['3d'] = a.flatten('F').tolist()

    elements = np.full((1, t.shape[1]), 0)
    for i in range(t.shape[1]):
        if t[0, i] == 1:
            elements[0, i] = 26 # 1 corresponds to iron in this case
        elif t[0, i] == 2:
            elements[0, i] = 78 # 2 correpeonds to platinum in this case
        else:
            print("Error, unknown number")

    dic['atoms']['elements'] = {}
    dic['atoms']['elements']['number'] = elements.flatten().tolist()

    with open(outputName, 'w') as outfile:
        json.dump(dic, outfile)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Translate MatLab files')
    parser.add_argument('-i', help='Input MatLab file', required=True)
    parser.add_argument('-t', help='Input MatLab atom types', required=True)
    parser.add_argument('-o', help='Output CJSON file', required=True)
    args = parser.parse_args()

    import_matlab(args.i, args.t, args.o)
