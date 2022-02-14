import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Card from '@material-ui/core/Card'
import React from 'react'
import Resource from '@shared/Resource'
import { CardContent } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
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