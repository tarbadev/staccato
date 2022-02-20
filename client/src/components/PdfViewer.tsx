import React from 'react'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
  iframe: {
    width: '100%', height: '100%',
  },
}))

type PdfViewerProps = {
  src: string;
  title?: string;
}

export const PdfViewer = ({src, title}: PdfViewerProps) => {
  const classes = useStyles()
  return <iframe src={src} title={title} className={classes.iframe} />
}