import { Card, CardHeader, CardMedia } from '@mui/material'
import React from 'react'
import Resource from '@shared/Resource'
import { DeleteButton } from './DeleteButton'

export const ImageCard = ({ resource, onDeleteClick }: { resource: Resource, onDeleteClick: Function }) => {
  return <Card>
    <CardHeader title={resource.title} action={<DeleteButton onDeleteClick={onDeleteClick} />} data-resource-title />
    <CardMedia
      component='img'
      image={resource.url}
      title={resource.title}
    />
  </Card>
}