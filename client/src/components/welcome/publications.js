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
                <i>{publication.title}</i>
                &nbsp; - &nbsp;
                {publication.authors}
                &nbsp; - &nbsp;
                <i>{publication.journal}</i>, <b>{publication.volume}</b> ({publication.year})
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}

export default PublicationsComponent;
