import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Card from '@material-ui/core/Card'
import React from 'react'
import Resource from '@shared/Resource'
import { CardContent } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
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