import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import MathJax from 'react-mathjax';
import PageHead from '../page-head';
import PageBody from '../page-body';


const style = (theme) => (
  {
  }
);

const fObs = `f_\\text{obs}^i(x, y)`;
const fCalc = `f_\\text{calc}^i(x, y)`;

const r1Formula0 = `
R_1^i = \\frac{\\sum_{x,y} \\left| ${fObs} - ${fCalc} \\right|}{\\sum_{x,y} \\left| ${fObs} \\right|}
`;

const r1Formula1 = `
R_1 = \\frac{\\sum_{i = 1}^N R_1^i}{N}
`;

class ValidationComponent extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <PageHead noOverlap>
          <Typography  color="inherit" gutterBottom variant="display1">
            Validation Process
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
          </Typography>
          <Typography color="inherit" gutterBottom variant="body2">
            A database is only as useful as the data that is in it.
            We believe that a rigorous form of validation is a vital part of the Materials Data Bank and have developed easy to use validation scripts using the freely available Python programming language.
          </Typography>
        </PageHead>
        <PageBody noOverlap>
          <MathJax.Provider>
            <Typography>
              After a new structure is deposited, an automated validation process will start to calculate the R1 factor of the structure using the following two equations.
            </Typography>
            <Typography>
              <MathJax.Node formula={r1Formula0}/>
              <MathJax.Node formula={r1Formula1}/>
            </Typography>
            <Typography>
              Where <MathJax.Node formula={fObs} inline /> is the <MathJax.Node formula={'i^\\text{th}'} inline /> measured projection, 
              <MathJax.Node formula={fCalc} inline /> is the <MathJax.Node formula={'i^\\text{th}'} inline /> calculated projection,
              which is linearly projected from the 3D atomic structure, and <MathJax.Node formula={'N'} inline /> is the total number of projections.
            </Typography>
            <Typography>
              Users can also download the Matlab or Python source code to calculate the <MathJax.Node formula={'R_1'} inline /> factor before depositing a structure.
              After the automated validation, all the information will be sent to the MDB team for manual validation of the structure and the authors will be contacted within seven days.
              After successful automated and manual validation, the structure will be deposited to the MDB and will be assigned with a MDB ID.
            </Typography>
          </MathJax.Provider>
        </PageBody>
      </div>
    );
  }
}

ValidationComponent = withStyles(style)(ValidationComponent);

export default ValidationComponent;
