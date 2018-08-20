# -*- coding: utf-8 -*-
"""
Created on Fri Aug  3 02:55:49 2018

@author: Yongsoo Yang, UCLA Physics & Astronomy
         yongsoo.ysyang@gmail.com
"""

from .fparameters_python import fparameters_python
import numpy as np

# main function for calculating R1 factor
def calc_R1_function_python(atomPos,atomType,Projections,Angles,Resolution,CropHalfWidth,VolSize,BF_Array,HTFact_Array,Axis_array):

    # rename variables
    currPos = atomPos
    currAtom = atomType
    currProjs = Projections
    currAngles =Angles
    volsize = VolSize

    # initialize array
    calcProjs = np.zeros(np.shape(currProjs))

    # loop over all projections
    for j in range(currAngles.shape[0]):

        # calculate rotation matrix based on current input angles and axis convention
        currMAT1 = MatrixQuaternionRot_python(np.array(Axis_array[0]),currAngles[j,0])
        currMAT2 = MatrixQuaternionRot_python(np.array(Axis_array[1]),currAngles[j,1])
        currMAT3 = MatrixQuaternionRot_python(np.array(Axis_array[2]),currAngles[j,2])

        MAT = currMAT1*currMAT2*currMAT3;

        # apply rotation matrix to the input atomic coordinates
        Model = (np.transpose(MAT) * np.matrix(currPos)).A

        # calculate projection based on the atomic model
        cProj = My_create_volProj_from_model_python(Model, currAtom, HTFact_Array, BF_Array, volsize, Resolution, CropHalfWidth)

        # determine shift value and crop indices for cropping the calculated projections
        SizeDiff0 = cProj.shape[0] - currProjs.shape[0]
        if SizeDiff0%2 == 0:
            AddShift0 = SizeDiff0 / 2
        else:
            AddShift0 = (SizeDiff0-1) / 2

        SizeDiff1 = cProj.shape[1] - currProjs.shape[1]
        if SizeDiff1%2 == 0:
            AddShift1 = SizeDiff1 / 2
        else:
            AddShift1 = (SizeDiff1-1) / 2

        CropInd0 = np.arange(currProjs.shape[0])
        CropInd0 = list(CropInd0 + int(AddShift0) - 1)

        CropInd1 = np.arange(currProjs.shape[1])
        CropInd1 = list(CropInd1 + int(AddShift1) - 1)

        # crop the calculated projection
        calcProjs[:,:,j] = cProj[np.ix_(CropInd0,CropInd1)]

    # calculate R factor
    Rfac = calcR_norm_YY_python(currProjs,calcProjs)

    return [calcProjs,Rfac]


# main function for calculating R1 factor using individual atomic scattering factor
def calc_R1_function_indivFA_python(atomPos,atomType,Projections,Angles,Resolution,
    CropHalfWidth,VolSize,BF_Array,HTFact_Array,Axis_array,AtomicNumbers, zDir):

    # rename variables
    currPos = atomPos
    currAtom = atomType
    currProjs = Projections
    currAngles =Angles
    volsize = VolSize

    # initialize array
    calcProjs = np.zeros(np.shape(currProjs))

    # loop over all projections
    for j in range(currAngles.shape[0]):

        # calculate rotation matrix based on current input angles and axis convention
        currMAT1 = MatrixQuaternionRot_python(np.array(Axis_array[0]),currAngles[j,0])
        currMAT2 = MatrixQuaternionRot_python(np.array(Axis_array[1]),currAngles[j,1])
        currMAT3 = MatrixQuaternionRot_python(np.array(Axis_array[2]),currAngles[j,2])

        MAT = currMAT1*currMAT2*currMAT3;

        # apply rotation matrix to the input atomic coordinates
        Model = (np.transpose(MAT) * np.matrix(currPos)).A

        # calculate projection based on the atomic model
        cProj = My_create_volProj_from_model_indivFA_python(Model, currAtom, HTFact_Array, BF_Array, AtomicNumbers, volsize, Resolution, CropHalfWidth, zDir)

        # determine shift value and crop indices for cropping the calculated projections
        SizeDiff0 = cProj.shape[0] - currProjs.shape[0]
        if SizeDiff0%2 == 0:
            AddShift0 = SizeDiff0 / 2
        else:
            AddShift0 = (SizeDiff0-1) / 2

        SizeDiff1 = cProj.shape[1] - currProjs.shape[1]
        if SizeDiff1%2 == 0:
            AddShift1 = SizeDiff1 / 2
        else:
            AddShift1 = (SizeDiff1-1) / 2

        CropInd0 = np.arange(currProjs.shape[0])
        CropInd0 = list(CropInd0 + int(AddShift0) - 1)

        CropInd1 = np.arange(currProjs.shape[1])
        CropInd1 = list(CropInd1 + int(AddShift1) - 1)

        # crop the calculated projection
        calcProjs[:,:,j] = cProj[np.ix_(CropInd0,CropInd1)]

    # calculate R factor
    Rfac = calcR_norm_YY_python(currProjs,calcProjs)

    return [calcProjs,Rfac]


# function for calculating projectons from the atomic model and H, B factors
def My_create_volProj_from_model_python(model, atomtype, Heights, Bfactors, volsize, Res, CropHalfWidth):

    # rescale model based on pixel resolution
    model = model / Res

    # rescale peak heights and B factors
    FHeights = Heights
    FWidths = Bfactors / np.pi**2 / Res**2

    # initialize xyz array for the volume
    if len(volsize) == 3:
        x = np.arange(volsize[0]) - np.round((volsize[0]+1)/2.) + 1
        y = np.arange(volsize[1]) - np.round((volsize[1]+1)/2.) + 1
        z = np.arange(volsize[2]) - np.round((volsize[2]+1)/2.) + 1
    elif len(volsize) == 1:
        x = np.arange(volsize[0]) - np.round((volsize[0]+1)/2.) + 1
        y = x
        z = x
    else:
        print('volsize should be either length 3 or length 1!')

    # a variable for the projection size
    sizeX = [len(x), len(y)]

    # check if there's any atom outside the projection size
    inInd = np.logical_and(np.logical_and(np.logical_and(np.logical_and (np.logical_and(model[0,:] >= np.min(x) , model[0,:] <= np.max(x)) ,
                 model[1,:] >= np.min(y)), model[1,:] <= np.max(y) ),
                 model[2,:] >= np.min(z)), model[2,:] <= np.max(z))


    # take only the atoms inside the projection
    calcModel = model[:,inInd]
    calcAtomtype = atomtype[:,inInd]


    # initialize projection array
    finalProj_padded = np.zeros( (len(x) + (CropHalfWidth+1)*2, len(y) + (CropHalfWidth+1)*2, len(Heights)))

    # proection center position
    cenPos = np.round((np.array(finalProj_padded.shape)+1)/2.)

    # local cropping indices for every atom
    cropIndRef = np.arange(-CropHalfWidth,CropHalfWidth+1)

    # meshgrid indices for local cropping
    [cropX,cropY] = np.meshgrid(cropIndRef,cropIndRef)
    cropX = cropX.T
    cropY = cropY.T

    #loop over all atoms in the model
    for i in range(calcModel.shape[1]):

        # obtain local cropping indices for current atom
        currPos1 = calcModel[0:2,i] + cenPos[0:2]
        currRndPos = np.round(currPos1)

        cropInd1 = cropIndRef + currRndPos[0] -1
        cropInd2 = cropIndRef + currRndPos[1] -1

        # crop the local region for current atom
        CropProj = finalProj_padded[np.ix_(list(cropInd1.astype(int)),list(cropInd2.astype(int)),list([calcAtomtype[0,i].astype(int)]))]

        # sub-pixel position difference for current atom from the center pixel
        diffPos = currPos1-currRndPos;
        diffPosZ = calcModel[2,i] - np.round(calcModel[2,i])

        # calculate Gaussian profile based on the H and B factor
        gaussCalc = (FHeights[calcAtomtype[0,i]]*np.exp( -1.*( (cropX-diffPos[0])**2 + (cropY-diffPos[1])**2 ) / FWidths[calcAtomtype[0,i]] )).reshape(CropProj.shape)

        gaussZcalc = (np.exp(-1.*(cropIndRef - diffPosZ)**2 / FWidths[calcAtomtype[0,i]] ))


        # update the local region in the projection
        finalProj_padded[np.ix_(list(cropInd1.astype(int)),list(cropInd2.astype(int)),list([calcAtomtype[0,i].astype(int)]))] = CropProj + gaussCalc*np.sum(gaussZcalc)


    # initialize final projection array
    finalProj_summed = np.zeros( (len(x), len(y)) )

    # initialize Fourier indices
    kx = np.arange(1,finalProj_summed.shape[0]+1)
    ky = np.arange(1,finalProj_summed.shape[1]+1)

    # apply Fourier resolution
    MultF_X = 1./(len(kx)*Res)
    MultF_Y = 1./(len(ky)*Res)

    # initialize q vectors
    CentPos = np.round((np.array(finalProj_summed.shape)+1)/2.)
    [KX, KY] = np.meshgrid((kx-CentPos[0])*MultF_X,(ky-CentPos[1])*MultF_Y)
    KX = KX.T
    KY = KY.T
    q2 = KX**2 + KY**2

    # obtain the tabulated electron scattering form factor based on the atomic number
    fa78 = fatom_vector_python( np.sqrt(q2),78 )
    fa26 = fatom_vector_python( np.sqrt(q2),26 )

    # average the electron scattering factor
    fixedfa = 0.5*(fa78+fa26)

    # loop over different type of atoms
    for j in range(len(Heights)):
        # crop to the original size image for current atom type
        CVol = finalProj_padded[(CropHalfWidth+1):(-1-CropHalfWidth),(CropHalfWidth+1):(-1-CropHalfWidth),j]

        # FFT
        FVol = np.fft.fftshift(np.fft.fftn(np.fft.ifftshift(CVol)))

        # apply the electron scattering factor
        FVol = FVol * fixedfa.reshape(sizeX)

        finalProj_summed =finalProj_summed+FVol

    # obtain final projection by IFFT
    Vol = np.real(np.fft.fftshift(np.fft.ifftn(np.fft.ifftshift(finalProj_summed))))

    return Vol



def My_create_volProj_from_model_indivFA_python(model, atomtype, Heights, Bfactors, AtomicNumbers, volsize, Res, CropHalfWidth, zDir):

    # rescale model based on pixel resolution
    model = model / Res

    # rescale peak heights and B factors
    FHeights = Heights
    FWidths = Bfactors / np.pi**2 / Res**2

    # initialize xyz array for the volume
    if len(volsize) == 3:
        x = np.arange(volsize[0]) - np.round((volsize[0]+1)/2.) + 1
        y = np.arange(volsize[1]) - np.round((volsize[1]+1)/2.) + 1
        z = np.arange(volsize[2]) - np.round((volsize[2]+1)/2.) + 1
    elif len(volsize) == 1:
        x = np.arange(volsize[0]) - np.round((volsize[0]+1)/2.) + 1
        y = x
        z = x
    else:
        print('volsize should be either length 3 or length 1!')

    # a variable for the projection size
    sizeX = [len(x), len(y)]

    # check if there's any atom outside the projection size
    inInd = np.logical_and(np.logical_and(np.logical_and(np.logical_and (np.logical_and(model[0,:] >= np.min(x) , model[0,:] <= np.max(x)) ,
                 model[1,:] >= np.min(y)), model[1,:] <= np.max(y) ),
                 model[2,:] >= np.min(z)), model[2,:] <= np.max(z))


    # take only the atoms inside the projection
    calcModel = model[:,inInd]
    calcAtomtype = atomtype[:,inInd]


    # initialize projection array
    finalProj_padded = np.zeros( (len(x) + (CropHalfWidth+1)*2, len(y) + (CropHalfWidth+1)*2, len(Heights)))

    # proection center position
    cenPos = np.round((np.array(finalProj_padded.shape)+1)/2.)

    # local cropping indices for every atom
    cropIndRef = np.arange(-CropHalfWidth,CropHalfWidth+1)

    # meshgrid indices for local cropping
    [cropX,cropY] = np.meshgrid(cropIndRef,cropIndRef)
    cropX = cropX.T
    cropY = cropY.T

    #loop over all atoms in the model
    for i in range(calcModel.shape[1]):

        # obtain local cropping indices for current atom
        if zDir == 2:
            currPos1 = calcModel[0:2,i] + cenPos[0:2]
            currRndPos = np.round(currPos1)
        elif zDir == 1:
            currPos1 = calcModel[[2, 0],i] + cenPos[0:2]
            currRndPos = np.round(currPos1)

        cropInd1 = cropIndRef + currRndPos[0] -1
        cropInd2 = cropIndRef + currRndPos[1] -1

        # crop the local region for current atom
        CropProj = finalProj_padded[np.ix_(list(cropInd1.astype(int)),list(cropInd2.astype(int)),list([calcAtomtype[0,i].astype(int)]))]

        # sub-pixel position difference for current atom from the center pixel
        diffPos = currPos1-currRndPos;

        if zDir == 2:
            diffPosZ = calcModel[2,i] - np.round(calcModel[2,i])
        elif zDir == 1:
            diffPosZ = calcModel[1,i] - np.round(calcModel[1,i])

        # calculate Gaussian profile based on the H and B factor
        gaussCalc = (FHeights[calcAtomtype[0,i]]*np.exp( -1.*( (cropX-diffPos[0])**2 + (cropY-diffPos[1])**2 ) / FWidths[calcAtomtype[0,i]] )).reshape(CropProj.shape)

        gaussZcalc = (np.exp(-1.*(cropIndRef - diffPosZ)**2 / FWidths[calcAtomtype[0,i]] ))


        # update the local region in the projection
        finalProj_padded[np.ix_(list(cropInd1.astype(int)),list(cropInd2.astype(int)),list([calcAtomtype[0,i].astype(int)]))] = CropProj + gaussCalc*np.sum(gaussZcalc)


    # initialize final projection array
    finalProj_summed = np.zeros( (len(x), len(y)) )

    # initialize Fourier indices
    kx = np.arange(1,finalProj_summed.shape[0]+1)
    ky = np.arange(1,finalProj_summed.shape[1]+1)

    # apply Fourier resolution
    MultF_X = 1./(len(kx)*Res)
    MultF_Y = 1./(len(ky)*Res)

    # initialize q vectors
    CentPos = np.round((np.array(finalProj_summed.shape)+1)/2.)
    [KX, KY] = np.meshgrid((kx-CentPos[0])*MultF_X,(ky-CentPos[1])*MultF_Y)
    KX = KX.T
    KY = KY.T
    q2 = KX**2 + KY**2

    # loop over different type of atoms
    for j in range(len(Heights)):
        # crop to the original size image for current atom type
        CVol = finalProj_padded[(CropHalfWidth+1):(-1-CropHalfWidth),(CropHalfWidth+1):(-1-CropHalfWidth),j]

        # FFT
        FVol = np.fft.fftshift(np.fft.fftn(np.fft.ifftshift(CVol)))

        # obtain the tabulated electron scattering form factor based on the atomic number
        currFA = fatom_vector_python( np.sqrt(q2),AtomicNumbers[j] )

        # apply the electron scattering factor
        FVol = FVol * currFA.reshape(sizeX)

        finalProj_summed =finalProj_summed+FVol

    # obtain final projection by IFFT
    Vol = np.real(np.fft.fftshift(np.fft.ifftn(np.fft.ifftshift(finalProj_summed))))

    return Vol


# function for calculating the electron scattering factor based on the tabulated value
def fatom_vector_python(q,Z):

    # get tabulated value based on atomic number
    fpara = fparameters_python(Z)

    # prepare the calculation variable based on the tabulated value
    a = np.array([fpara[1], fpara[3], fpara[5]])
    b = np.array([fpara[2], fpara[4], fpara[6]])
    c = np.array([fpara[7], fpara[9], fpara[11]])
    d = np.array([fpara[8], fpara[10], fpara[12]])

    num =q.size
    v = np.zeros((num))

    q = q.reshape(num)

    # calculate the electron scattering factor for each q vector
    for hh in range(num):
        #% Lorenzians %
        suml = np.sum( a/((q[hh]**2)+b) )

        #% Gaussians %
        sumg = np.sum( c*np.exp(-(q[hh]**2)*d) )

        v[hh] = suml + sumg

    return v

# function for calculating R factor with least sqare normalization
def calcR_norm_YY_python(data1,data2):

    # reshape array
    data1 = data1.reshape((data1.size))
    data2 = data2.reshape((data2.size))

    if len(data1)!=len(data2):
        print('data length does not match!\n')
        R = -1
    else:
        # scale factor for least square noamlization
        lscale = np.dot(data1,data2)/np.linalg.norm(data2)**2

        # normalize
        data2 = data2 * lscale

        # calculate R factor
        R = np.sum(np.abs(np.abs(data1)-np.abs(data2)))/np.sum(np.abs(data1))

    return R


# function for obatining rotation matrix based on quaternion algorithm
def MatrixQuaternionRot_python(vector,theta):

    theta = theta*np.pi/180;
    vector = vector / np.linalg.norm(vector);
    w = np.cos(theta/2.)
    x = -np.sin(theta/2.)*vector[0]
    y = -np.sin(theta/2)*vector[1]
    z = -np.sin(theta/2)*vector[2]

    RotM = [[1-2*y**2-2*z**2 , 2*x*y+2*w*z, 2*x*z-2*w*y],
      [2*x*y-2*w*z, 1-2*x**2-2*z**2, 2*y*z+2*w*x],
      [2*x*z+2*w*y, 2*y*z-2*w*x, 1-2*x**2-2*y**2]]

    dd = np.matrix(np.array(RotM))
    return dd
