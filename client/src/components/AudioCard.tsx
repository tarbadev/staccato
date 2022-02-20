import React from 'react'
import Resource from '@shared/Resource'
import { CardContent, Card, CardMedia, CardHeader, Typography } from '@mui/material'
import { DeleteButton } from './DeleteButton'

export const AudioCard = ({ resource, onDeleteClick }: { resource: Resource, onDeleteClick: Function }) => {
  const title = resource.album && resource.title ? `${resource.title} - ${resource.album}` : resource.title
  const type = resource.audioType === 'song' ? 'Song' : 'Playback'

  return <Card>
    <CardHeader title={title}
                subheader={resource.authors?.join(', ')}
                data-resource-title
                action={<DeleteButton onDeleteClick={onDeleteClick} />} />
    <CardMedia
      component='audio'
      src={resource.url}
      image={resource.url}
      title={resource.title}
      controls
    />
    <CardContent>
      <Typography paragraph data-music-resource-type>Type: {type}</Typography>
    </CardContent>
  </Card>
}