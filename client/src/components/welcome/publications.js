import React, { Component } from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

class PublicationsComponent extends Component {
  render() {
    const {publications} = this.props;
    return (
      <div>
        {publications.map((publication, i) => (
          <Card style={{marginBottom: '1rem'}} key={i}>
            <CardContent>
              <Typography>
                {publication.authors}, <i>{publication.title}</i>, <i>{publication.journal}</i>, <b>{publication.volume}</b>, {publication.page} ({publication.year})
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}

export default PublicationsComponent;
