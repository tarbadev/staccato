import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import React, { useState } from 'react'
import Resource from '@shared/Resource'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export const SongPartitionCard = ({ resource }: { resource: Resource }) => {
  const [numPages, setNumPages] = useState(0)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  return <Card>
    {resource.title && <CardHeader title={resource.title}
                                   subheader={resource.authors?.join(', ')} data-resource-title />}
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