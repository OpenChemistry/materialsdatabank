# -*- coding: utf-8 -*-
"""
Created on Fri Aug  3 02:55:49 2018

@author: Yongsoo Yang, UCLA Physics & Astronomy
         yongsoo.ysyang@gmail.com
"""

# for R1 factor calculation, we need to input the following parameters:
    # Experimentally measured projections (currProjs:   MxMxP array, M: size of projection, P: number of projections)
    # Experimentally measured projection angles (currAngles:    Px3 array, P: number of projections)
    # Determined atomic coordinates (currPos:   3xN array, N: number of atoms)
    # Determined atomic species (currAtom: 1xN array,   N: number of atoms), each element should be an integer ranging from 0 to # of species (L).
    #                           if there are total 3 different chemical species in the model, the each element of this array can be 0, 1, or 2.

    # Determined atomic numbers for each atomic species (AtomicNumbers: 1xL array,    L: number of different kind of chemical species in the model)
    # Determined B factors for each atomic species (BF_Array: 1xL array,    L: number of different kind of chemical species in the model)
    # Determined H factors for each atomic species (HTFact_Array: 1xL array,    L: number of different kind of chemical species in the model)
    # Pixel size (resolution)
    # CropHalfWidth (# of pixels for half width, this determines how many pixels will be used for simulating each atom)
    # VolSize (size of the projection to be simulated)
    # AxisConvention (xyz axis convention for GENFIRE reconstruction)
    # zDir (projection directon during the GENIFRE itertaion, should 1 (y-direction) or 2 (z-direction))

import numpy as np
import scipy.io as spio
import calc_R1_function_python_GEN

# load data
stringList = 'OldFePt'
currPos = spio.loadmat('currModel_{0}.mat'.format(stringList))
currAtom = spio.loadmat('currAtom_{0}.mat'.format(stringList))
currProjs = spio.loadmat('currProjection_{0}.mat'.format(stringList))
currAngles =spio.loadmat('currAngle_{0}.mat'.format(stringList))

currPos = currPos['currModel']
currAtom = currAtom['currAtom'] - 1
currProjs = currProjs['currProjection']
currAngles =currAngles['currAngle']

# atomic numbers
AtomicNumbers = np.array([26, 78])

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


# run R1 calculation
Result = calc_R1_function_python_GEN.calc_R1_function_indivFA_python(currPos,currAtom,currProjs,currAngles,Resolution,CropHalfWidth,VolSize,BF_Array,HTFact_Array,Axis_array,AtomicNumbers,zDir)


# print result
calcProjs=Result[0]
print(Result[1])



#%%
'''
# load data
stringList = 'Particle1_meas1'
currPos = sp.io.loadmat('currModel_{0}.mat'.format(stringList))
currAtom = sp.io.loadmat('currAtom_{0}.mat'.format(stringList))
currProjs = sp.io.loadmat('currProjection_{0}.mat'.format(stringList))
currAngles =sp.io.loadmat('currAngle_{0}.mat'.format(stringList))

currPos = currPos['currModel']
currAtom = currAtom['currAtom'] - 1
currProjs = currProjs['currProjection']
currAngles =currAngles['currAngle']

# atomic numbers
AtomicNumbers = np.array([26, 78])

# pixel size (resolution)
Resolution = 0.338

# CropHlafWidth
CropHalfWidth = 7

# VolSize
VolSize = [256]


# z direction
zDir = 2

# BF arary
BF_Array = np.array([5.6727, 9.6695])

# HT array
HTFact_Array = np.array([ 0.9285, 1.4729])

# axis convention
Axis_array = [[0,0,1],[0,1,0],[1,0,0]]


# run R1 calculation
Result = calc_R1_function_python_GEN.calc_R1_function_indivFA_python(currPos,currAtom,currProjs,currAngles,Resolution,CropHalfWidth,VolSize,BF_Array,HTFact_Array,Axis_array,AtomicNumbers,zDir)

# print result
calcProjs=Result[0]
print(Result[1])
'''
