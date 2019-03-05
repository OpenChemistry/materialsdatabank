import React from 'react';
import { has } from 'lodash-es';

import { Field } from 'redux-form'

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';

import FileInputField from './fileField';
import { arrayValidation, required, ensureNumber } from './validation';

export function fullFormFields(create = true) {
  return {
    ...generalInformationFields(create),
    ...dataCollectionFields(create),
    ...reconstructionFields(create)
  }
}

export function generalInformationFields(create = true) {
  const fields = {
    title: {
      label: 'Name of the Structure',
      type: 'text',
      placeholder: 'Example: 3D chemical order/disorder of an FePt nanoparticle',
      validate: [required]
    },
    authors: {
      label: 'Deposition author(s) ("and" separated)',
      type: 'text',
      placeholder: 'Example: Kim, D and Miao, J.',
      validate: [required]
    },
    // emailaddress: {
    //   label: 'Email address',
    //   type: 'text',
    //   placeholder: 'Example: materialsdatabank@gmail.com',
    //   validate: [required]
    // },
    doi: {
      label: 'DOI',
      type: 'text',
      placeholder: 'Example: 10.1038/nature21042',
    },
    fundingorg: {
      label: 'Funding Organization(s)',
      type: 'text',
      placeholder: 'Example: DOE and NSF',
    },
    reconalgorithm: {
      label: 'Reconstruction Algorithm',
      type: 'text',
      placeholder: 'Example: GENFIRE',
    },
    imageFile: {
      label: 'Image file ( Thumbnail for dataset )',
      type: 'file'
    },
    structureFile: {
      label: 'Structure file ( XYZ )',
      type: 'file',
      validate: create ? [required] : []
    },
    reconstructionFile: {
      label: 'Reconstruction file ( EMD format )',
      type: 'file',
      validate: create ? [required] : []
    },
    projectionFile: {
      label: 'Projection file ( EMD format )',
      type: 'file',
      validate: create ? [required] : []
    }
  }
  return fields;
}

export function dataCollectionFields(create = true) {
  const fields = {
    voltage: {
      label: 'Voltage (kV)',
      type: 'text',
      placeholder: '300',
      validate: [required, ensureNumber]
    },
    convergenceSemiAngle: {
      label: 'Convergence semi-angle (mrad)',
      type: 'text',
      placeholder: '30',
      validate: [required, ensureNumber]
    },
    probeSize: {
      label: 'Probe size (Å)',
      type: 'text',
      placeholder: '0.5',
      validate: [required, ensureNumber]
    },
    detectorInnerAngle: {
      label: 'Detector inner angle (mrad)',
      type: 'text',
      placeholder: '38',
      validate: [required, ensureNumber]
    },
    detectorOuterAngle: {
      label: 'Detector outer angle (mrad)',
      type: 'text',
      placeholder: '190',
      validate: [required, ensureNumber]
    },
    depthOfFocus: {
      label: 'Depth of focus (nm)',
      type: 'text',
      placeholder: '10',
      validate: [required, ensureNumber]
    },
    pixelSize: {
      label: 'Pixel size (Å)',
      type: 'text',
      placeholder: '0.34',
      validate: [required, ensureNumber]
    },
    nProjections: {
      label: 'Number of projections',
      type: 'text',
      placeholder: '38',
      validate: [required, ensureNumber]
    },
    tiltRange: {
      label: 'Tilt range (°)',
      type: 'text',
      placeholder: '[-65, 65]',
      validate: [required, arrayValidation([2])]
    },
    electronDose: {
      label: 'Total electron dose (e/Å^2)',
      type: 'text',
      placeholder: '6e6',
      validate: [required, ensureNumber]
    }
  }
  return fields;
}

export function reconstructionFields(create = true) {
  const fields = {
    resolution: {
      label: 'Resolution',
      type: 'text',
      tooltip: 'Resolution of the projections. It should have units consistent with the atomic coordinates of the model (Usually px/Angstrom)',
      placeholder: '0.34',
      validate: [required, ensureNumber]
    },
    cropHalfWidth: {
      label: 'Crop Half Width',
      type: 'text',
      placeholder: '7',
      tooltip: 'This value should be changed based on the pixel size and B factor.',
      validate: [required, ensureNumber]
    },
    volumeSize: {
      label: 'Number of pixels in each direction',
      type: 'text',
      placeholder: 'Example: [256, 256, 256]',
      tooltip: 'The number of pixels in the reconstructed volume along each direction.',
      validate: [required, arrayValidation([3])]
    },
    zDirection: {
      label: 'Z Direction',
      type: 'text',
      placeholder: '1',
      tooltip: 'Projection direction during the GENIFRE iteration (integer). 0 = x, 1 = y, 2 = z',
      validate: [required, ensureNumber]
    },
    bFactor: {
      label: 'B’-factor array (Å^2)',
      type: 'text',
      placeholder:'[5.4855,5.036]',
      tooltip: 'B’ factors array, one value per atomic species. The B factor accounts for the electron probe size (50 pm), the thermal motions, and the reconstruction error for different chemical elements.',
      validate: [required, arrayValidation(null)]
    },
    hFactor: {
      label: 'H-factor array',
      type: 'text',
      placeholder:'[0.5624, 1.1842]',
      tooltip: 'H factors array, one value per atomic species. The H factor accounts for electron scattering cross sections for different atomic species in the given experimental conditions.',
      validate: [required, arrayValidation(null)]
    },
    axisConvention: {
      label: 'Axis convention',
      type: 'text',
      placeholder: 'Example: [[1, 0, 0], [0, 1, 0], [0, 0, 1]]',
      tooltip: 'GENFIRE rotation axis direction for phi, theta, psi directions, respectively.',
      validate: [required, arrayValidation([3, 3])]
    }
  }
  return fields;
}

export function renderFormFields(fields) {
  let formFields = [];
  for (let key in fields) {
    const field = fields[key];
    const multiline = field.type === 'textarea';
    const type = multiline ? 'text' : field.type;
    const label = field.label;
    const placeholder = field.placeholder;
    const tooltip = field.tooltip;
    const disabled = field.hasOwnProperty('disabled') ? field.disabled : false;
    const hidden = field.hasOwnProperty('hidden') ? field.hidden : false;
    const validate = field.validate || [];

    switch (type) {
      case 'checkbox': {
        formFields.push(
          <div
            key={key}
            hidden={hidden}
          >
            <Field
              name={key}
              component={renderCheckField}
              label={label}
              disabled={disabled}
              hidden={hidden}
            />
          </div>
        );
        break;
      }

      case 'file': {
        formFields.push(
          <div
            key={key}
            hidden={hidden}
          >
            <Field
              type='text'
              name={key}
              component={FileInputField}
              label={label}
              disabled={disabled}
              hidden={hidden}
              validate={validate}
            />
          </div>
        );
        break;
      }

      case 'date':
      case 'text': {
        formFields.push(
          <div
            key={key}
            hidden={hidden}
            title={tooltip}
          >
            <Field
              type={type}
              name={key}
              component={renderTextField}
              label={label}
              multiline={multiline}
              rows={6}
              disabled={disabled}
              hidden={hidden}
              validate={validate}
              placeholder={placeholder}
            />
          </div>
        );
        break;
      }

      default: {
        break;
      }
    }
  }
  return formFields;
}

const renderTextField = (field) => {
  return (
    <div style={{marginBottom: "1rem"}}>
      <TextField
        fullWidth
        InputLabelProps={{shrink: true}}
        type={field.type}
        label={field.label}
        error={field.meta.touched && !!field.meta.error}
        helperText={field.meta.error ? field.meta.error : ''}
        multiline={field.multiline}
        rows={field.rows}
        disabled={field.disabled}
        placeholder={field.placeholder}
        {...field.input}
        // onChange={(e)=>{console.log(e); field.input.onChange(e);}}
      />
    </div>
  )
};

const renderCheckField = (field) => {
  field = {...field};
  const checked = field.input.value;
  delete field.input.value;
  return (
    <div style={{marginBottom: "1rem"}}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            disabled={field.disabled}
            {...field.input}
          />
        }
        label={field.label}
      />
    </div>
  )
};
