import React from 'react'
import Resource from '@shared/Resource'
import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import { DeleteButton } from './DeleteButton'
import { PdfViewer } from './PdfViewer'

type OrchestralPartitionCardProps = {
  resource: Resource;
  onDeleteClick: Function;
}

export const OrchestralPartitionCard = ({
                                          resource,
                                          onDeleteClick,
                                        }: OrchestralPartitionCardProps) => {
  const composersSubHeader = resource.composers?.join(', ')
  const arrangersSubHeader = resource.arrangers?.join(', ')
  const subHeader = `Composed by ${composersSubHeader} - Arranged by ${arrangersSubHeader}`

  return <Card style={{ height: '100vh' }}>
    <CardHeader title={resource.title}
                subheader={subHeader}
                data-resource-title
                action={<DeleteButton onDeleteClick={onDeleteClick} />} />
    <CardContent>
      <Typography color='textSecondary' gutterBottom data-resource-instruments>
        Instruments: {resource.instruments?.join(', ')}
      </Typography>
    </CardContent>
    <PdfViewer src={resource.url} title={resource.title} />
  </Card>
}