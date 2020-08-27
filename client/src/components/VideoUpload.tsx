import { DropzoneFileUpload } from './DropzoneFileUpload'
import React, { useState } from 'react'
import { FileObject } from 'material-ui-dropzone'
import TextField from '@material-ui/core/TextField'

type VideoUploadProps = {
  onCancel: () => void;
  onSubmit: (title: string, file: FileObject, source: string, authors: string[]) => void;
}
export const VideoUpload = ({ onCancel, onSubmit }: VideoUploadProps) => {
  const [title, setTitle] = useState('')
  const [source, setSource] = useState('')
  const [authors, setAuthors] = useState('')

  const submitVideo = (file: FileObject) => {
    onSubmit(title, file, source, authors.split(';'))
  }

  const titleComponent = <TextField
    key='video-upload-title'
    fullWidth={true}
    value={title}
    onChange={({ target }) => setTitle(target.value)}
    label='Title'
    id='title'
    data-add-video-title
  />

  const sourceComponent = <TextField
    key='video-upload-source'
    fullWidth={true}
    value={source}
    onChange={({ target }) => setSource(target.value)}
    label='Source'
    id='source'
    data-add-video-source
  />

  const authorsComponent = <TextField
    key='video-upload-authors'
    fullWidth={true}
    value={authors}
    onChange={({ target }) => setAuthors(target.value)}
    label='Authors (Separate with a ";")'
    id='authors'
    data-add-video-authors
  />

  return <DropzoneFileUpload dataTag='video' acceptedFiles={['video/*']} onCancelClick={onCancel}
                             onSubmitClick={submitVideo} topFields={[titleComponent, sourceComponent, authorsComponent]} />
}