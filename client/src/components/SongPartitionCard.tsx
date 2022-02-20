import React from 'react'
import { Card, CardHeader } from '@mui/material'
import Resource from '@shared/Resource'
import { DeleteButton } from './DeleteButton'
import { PdfViewer } from './PdfViewer'

export const SongPartitionCard = ({ resource, onDeleteClick }: { resource: Resource, onDeleteClick: Function }) => {
  return <Card style={{ height: '100vh' }}>
    <CardHeader title={resource.title}
                subheader={resource.authors?.join(', ')}
                data-resource-title
                action={<DeleteButton onDeleteClick={onDeleteClick} />} />
    <PdfViewer src={resource.url} title={resource.title} />
  </Card>
}