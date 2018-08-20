import numpy as np
import scipy.io as spio
from . import calc_R1_function_python_GEN

def calculate_r1_factor(proj, proj_angles, atom_positions, atomic_spec, atomic_numbers):
    # pixel size (resolution)
    Resolution = 0.3725

    # CropHlafWidth
    CropHalfWidth = 7

    # VolSize
    VolSize = [276]

    # z direction
    zDir = 1

    # BF arary
    BF_Array = np.array([5.4855,5.0360])

    # HT array
    HTFact_Array = np.array([0.5624, 1.1842])

    # axis convention
    Axis_array = [[0,0,1],[0,1,0],[0,0,1]]

    Result = calc_R1_function_python_GEN.calc_R1_function_indivFA_python(atom_positions,
        atomic_spec, proj, proj_angles, Resolution, CropHalfWidth, VolSize,
        BF_Array, HTFact_Array, Axis_array, atomic_numbers, zDir)

    return Result[0][1]
