import { DropzoneFileUpload } from './DropzoneFileUpload'
import React, { useState } from 'react'
import { FileObject } from 'material-ui-dropzone'
import TextField from '@material-ui/core/TextField'
import { AudioType } from '@shared/Resource'
import { Grid } from '@material-ui/core'
import Switch from '@material-ui/core/Switch'

type MusicUploadProps = {
  onCancel: () => void;
  onSubmit: (title: string, fileToUpload: FileObject, album: string, authors: string[], audioType: AudioType) => void;
}
export const AudioUpload = ({ onCancel, onSubmit }: MusicUploadProps) => {
  const [title, setTitle] = useState('')
  const [album, setAlbum] = useState('')
  const [authors, setAuthors] = useState('')
  const [audioType, setAudioType] = useState<AudioType>('song')

  const submitMusic = (file: FileObject) => {
    onSubmit(title, file, album, authors.split(';'), audioType)
  }

  const titleComponent = <TextField
    key='music-upload-title'
    fullWidth={true}
    value={title}
    onChange={({ target }) => setTitle(target.value)}
    label='Title'
    id='title'
    data-add-music-title
  />

  const sourceComponent = <TextField
    key='music-upload-album'
    fullWidth={true}
    value={album}
    onChange={({ target }) => setAlbum(target.value)}
    label='Album'
    id='album'
    data-add-music-album
  />

  const authorsComponent = <TextField
    key='music-upload-authors'
    fullWidth={true}
    value={authors}
    onChange={({ target }) => setAuthors(target.value)}
    label='Authors (Separate with a ";")'
    id='authors'
    data-add-music-authors
  />

  const audioTypeComponent = <Grid component='label' container alignItems='center' spacing={1} key='music-upload-type'>
    <Grid item>Song</Grid>
    <Grid item>
      <Switch
        checked={audioType === 'playback'}
        onChange={({target}) => setAudioType(target.value === 'song' ? 'playback' : 'song')}
        value={audioType}
        data-add-music-type
      />
    </Grid>
    <Grid item>Playback</Grid>
  </Grid>

  return <DropzoneFileUpload dataTag='music' acceptedFiles={['audio/*']} onCancelClick={onCancel}
                             onSubmitClick={submitMusic} topFields={[titleComponent, sourceComponent, authorsComponent, audioTypeComponent]} />
}