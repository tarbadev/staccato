import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Card from '@material-ui/core/Card'
import React from 'react'
import Resource from '@shared/Resource'

export const ImageCard = ({ resource }: { resource: Resource }) => {
  return <Card>
    {resource.title && <CardHeader title={resource.title} data-resource-title />}
    <CardMedia
      component='img'
      image={resource.url}
      title={resource.title}
    />
  </Card>
}