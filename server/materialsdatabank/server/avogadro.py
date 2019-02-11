from avogadro.core import Molecule
from avogadro.io import FileFormatManager
import json


def convert_str(str_data, in_format, out_format):
    mol = Molecule()
    conv = FileFormatManager()
    opts = {}
    opts['perceiveBonds'] = False
    conv.read_string(mol, str_data, in_format, json.dumps(opts))

    return conv.write_string(mol, out_format)
