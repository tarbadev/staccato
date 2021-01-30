import { DropzoneFileUpload } from './DropzoneFileUpload'
import React, { useState } from 'react'
import { FileObject } from 'material-ui-dropzone'
import TextField from '@material-ui/core/TextField'

type OrchestralPartitionUploadProps = {
  onCancel: () => void;
  onSubmit: (title: string, file: FileObject, composers: string[], arrangers: string[], instruments: string[]) => void;
}
export const OrchestralPartitionUpload = ({ onCancel, onSubmit }: OrchestralPartitionUploadProps) => {
  const [title, setTitle] = useState('')
  const [composers, setComposers] = useState('')
  const [arrangers, setArrangers] = useState('')
  const [instruments, setInstruments] = useState('')

  const submitForm = (file: FileObject) => {
    onSubmit(title, file, composers.split(';'), arrangers.split(';'), instruments.split(';'))
  }

  const titleComponent = <TextField
    key='orchestral-partition-upload-title'
    fullWidth={true}
    value={title}
    onChange={({ target }) => setTitle(target.value)}
    label='Title'
    id='title'
    data-add-orchestral-partition-title
  />

  const composersComponent = <TextField
    key='orchestral-partition-upload-composers'
    fullWidth={true}
    value={composers}
    onChange={({ target }) => setComposers(target.value)}
    label='Composers (Separate with a ";")'
    id='composers'
    data-add-orchestral-partition-composers
  />

  const arrangersComponent = <TextField
    key='orchestral-partition-upload-arrangers'
    fullWidth={true}
    value={arrangers}
    onChange={({ target }) => setArrangers(target.value)}
    label='Arrangers (Separate with a ";")'
    id='arrangers'
    data-add-orchestral-partition-arrangers
  />

  const instrumentsComponent = <TextField
    key='orchestral-partition-upload-instruments'
    fullWidth={true}
    value={instruments}
    onChange={({ target }) => setInstruments(target.value)}
    label='Instruments (Separate with a ";")'
    id='instruments'
    data-add-orchestral-partition-instruments
  />

  return <DropzoneFileUpload dataTag='orchestral-partition'
                             acceptedFiles={['application/pdf']}
                             onCancelClick={onCancel}
                             onSubmitClick={submitForm}
                             topFields={[
                               titleComponent,
                               composersComponent,
                               arrangersComponent,
                               instrumentsComponent,
                             ]} />
}