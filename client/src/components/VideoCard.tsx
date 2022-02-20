import React from 'react'
import { Card, CardContent, CardHeader, CardMedia, Typography } from '@mui/material'
import Resource from '@shared/Resource'
import { Link } from 'react-router-dom'
import { DeleteButton } from './DeleteButton'

export const VideoCard = ({ resource, onDeleteClick }: { resource: Resource, onDeleteClick: Function }) => {
  return <Card>
    <CardHeader title={resource.title}
                subheader={resource.authors?.join(', ')}
                data-resource-title
                action={<DeleteButton onDeleteClick={onDeleteClick} />} />
    <CardMedia
      component='video'
      src={resource.url}
      image={resource.url}
      title={resource.title}
      controls
    />
    {resource.source &&
        <CardContent>
          <Typography paragraph
                      data-resource-source>Source: <Link to={resource.source}>{resource.source}</Link></Typography>
        </CardContent>
    }
  </Card>
}