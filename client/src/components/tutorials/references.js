import React from 'react';
import Typography from '@material-ui/core/Typography';
import PageHead from '../page-head';
import PageBody from '../page-body';
import Publications from '../welcome/publications';
import references from './references.json';

const ReferencesComponent = () => {
  return (
    <div>
      <PageHead>
        <Typography  color="inherit" gutterBottom variant="display1">
          References
        </Typography>
        <Typography variant="subheading" paragraph color="inherit">
        </Typography>
      </PageHead>
      <PageBody>
        <Publications publications={references}/>
      </PageBody>
    </div>
  )
};

export default ReferencesComponent;