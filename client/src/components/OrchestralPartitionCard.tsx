import React, { useState } from 'react'
import Resource from '@shared/Resource'
import { Document, Page, pdfjs } from 'react-pdf'
import { CardContent, Typography, CardHeader, Card } from '@mui/material'
import { DeleteButton } from './DeleteButton'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export const OrchestralPartitionCard = ({
                                          resource,
                                          onDeleteClick,
                                        }: { resource: Resource, onDeleteClick: Function }) => {
  const [numPages, setNumPages] = useState(0)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const composersSubHeader = resource.composers?.join(', ')
  const arrangersSubHeader = resource.arrangers?.join(', ')
  const subHeader = `Composed by ${composersSubHeader} - Arranged by ${arrangersSubHeader}`

  return <Card>
    <CardHeader title={resource.title}
                subheader={subHeader}
                data-resource-title
                action={<DeleteButton onDeleteClick={onDeleteClick} />} />
    <CardContent>
      <Typography color='textSecondary' gutterBottom data-resource-instruments>
        Instruments: {resource.instruments?.join(', ')}
      </Typography>
    </CardContent>
    <Document
      file={`https://cors-anywhere.herokuapp.com/${resource.url}`}
      onLoadSuccess={onDocumentLoadSuccess}
      options={{ httpHeaders: { 'Access-Control-Allow-Origin': '*' } }}
    >
      {Array.from(
        new Array(numPages),
        (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
          />
        ),
      )}
    </Document>
  </Card>
}