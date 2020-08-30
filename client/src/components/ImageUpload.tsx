import { DropzoneFileUpload } from './DropzoneFileUpload'
import React, { useState } from 'react'
import { FileObject } from 'material-ui-dropzone'
import TextField from '@material-ui/core/TextField'

type ImageUploadProps = {
  onCancel: () => void;
  onSubmit: (title: string, file: FileObject) => void;
}
export const ImageUpload = ({ onCancel, onSubmit }: ImageUploadProps) => {
  const [title, setTitle] = useState('')

  const submitImage = (file: FileObject) => {
    onSubmit(title, file)
  }

  const titleComponent = <TextField
    key='image-upload-title'
    fullWidth={true}
    value={title}
    onChange={({ target }) => setTitle(target.value)}
    label='Title'
    id='title'
    data-add-image-title
  />

  return <DropzoneFileUpload dataTag='image' acceptedFiles={['image/*']} onCancelClick={onCancel}
                             onSubmitClick={submitImage} topFields={[titleComponent]} />
}