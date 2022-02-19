import React, { useState } from 'react'
import { DropzoneArea, FileObject } from 'material-ui-dropzone'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

type DropZoneUpload = {
  dataTag: string;
  acceptedFiles: string[];
  topFields: React.ReactNode[];
  onCancelClick: () => void;
  onSubmitClick: (file: FileObject) => void;
}
export const DropzoneFileUpload = ({ dataTag, acceptedFiles, topFields, onCancelClick, onSubmitClick }: DropZoneUpload) => {
  const [fileUpload, setFileUpload] = useState<FileObject>()
  const [submitEnabled, setSubmitEnabled] = useState(false)

  const maxFileSize = 1024 * 1024 * 10

  const onSubmit = () => {
    if (fileUpload) {
      onSubmitClick(fileUpload)
    }
  }

  return <div data-dropzone-container={dataTag}>
    {topFields}
    <DropzoneArea
      acceptedFiles={acceptedFiles}
      maxFileSize={maxFileSize}
      showPreviews={false}
      showPreviewsInDropzone={true}
      showFileNamesInPreview={true}
      onChange={(files) => {
        if (files[0]) {
          const reader = new FileReader()

          reader.addEventListener('load', function () {
            setFileUpload({ data: reader.result, file: files[0] })
            setSubmitEnabled(true)
          }, false)

          reader.readAsDataURL(files[0])
        } else {
          setSubmitEnabled(false)
        }
      }}
      inputProps={{ 'aria-label': 'dropzone' }}
      filesLimit={1}
    />
    <Grid
      container
      direction='row'
      justify='flex-end'
      alignItems='center'
    >
      <Button variant='outlined' onClick={onCancelClick}>Cancel</Button>
      <Button variant='outlined' color='primary' disabled={!submitEnabled} onClick={onSubmit}
              data-button-submit>Submit</Button>
    </Grid>
  </div>
}