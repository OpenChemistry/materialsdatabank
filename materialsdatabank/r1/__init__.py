import numpy as np
import scipy.io as spio
from . import calc_R1_function_python_GEN


def calculate_r1_factor(proj, proj_angles, atom_positions, atomic_spec, atomic_numbers,
                        resolution, crop_half_width, volume_size,
                        z_direction, b_factor, h_factor, axis_convention):

    Result = calc_R1_function_python_GEN.calc_R1_function_indivFA_python(atom_positions,
        atomic_spec, proj, proj_angles, resolution, crop_half_width, volume_size,
        np.array(b_factor), np.array(h_factor), np.array(axis_convention), atomic_numbers, z_direction)

    return Result[1]

