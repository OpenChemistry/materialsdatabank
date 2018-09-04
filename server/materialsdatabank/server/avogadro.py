from avogadro2 import *
import json


def convert_str(str_data, in_format, out_format):
    mol = Molecule()
    conv = FileFormatManager()
    opts = {}
    opts['perceiveBonds'] = False
    conv.readString(mol, str_data, in_format, json.dumps(opts))

    return conv.writeString(mol, out_format)
