import { DropzoneFileUpload } from './DropzoneFileUpload'
import React, { useState } from 'react'
import { FileObject } from 'material-ui-dropzone'
import TextField from '@material-ui/core/TextField'

type SongPartitionUploadProps = {
  onCancel: () => void;
  onSubmit: (title: string, file: FileObject, authors: string[]) => void;
}
export const SongPartitionUpload = ({ onCancel, onSubmit }: SongPartitionUploadProps) => {
  const [title, setTitle] = useState('')
  const [authors, setAuthors] = useState('')

  const submitForm = (file: FileObject) => {
    onSubmit(title, file, authors.split(';'))
  }

  const titleComponent = <TextField
    key='song-partition-upload-title'
    fullWidth={true}
    value={title}
    onChange={({ target }) => setTitle(target.value)}
    label='Title'
    id='title'
    data-add-song-partition-title
  />

  const authorsComponent = <TextField
    key='song-partition-upload-authors'
    fullWidth={true}
    value={authors}
    onChange={({ target }) => setAuthors(target.value)}
    label='Authors (Separate with a ";")'
    id='authors'
    data-add-song-partition-authors
  />

  return <DropzoneFileUpload dataTag='song-partition' acceptedFiles={['application/pdf']} onCancelClick={onCancel}
                             onSubmitClick={submitForm} topFields={[titleComponent, authorsComponent]} />
}