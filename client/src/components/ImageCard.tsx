import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Card from '@material-ui/core/Card'
import React from 'react'
import Resource from '@shared/Resource'
import { DeleteButton } from './DeleteButton'

export const ImageCard = ({ resource, onDeleteClick }: { resource: Resource, onDeleteClick: Function }) => {
  return <Card>
    <CardHeader title={resource.title} action={<DeleteButton onDeleteClick={onDeleteClick} />} />
    <CardMedia
      component='img'
      image={resource.url}
      title={resource.title}
    />
  </Card>
}