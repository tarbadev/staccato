import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import React, { useState } from 'react'
import { ImageUpload } from './ImageUpload'
import { VideoUpload } from './VideoUpload'
import { AudioUpload } from './AudioUpload'
import Button from '@material-ui/core/Button'
import { FileObject } from 'material-ui-dropzone'
import { AudioType } from '@shared/Resource'
import { UploadRequest } from '@shared/UploadRequest'
import { SongPartitionUpload } from './SongPartitionUpload'
import { OrchestralPartitionUpload } from './OrchestralPartitionUpload'

type ResourceUploadProps = {
  uploadResource: (request: UploadRequest) => void;
}
export const ResourceUpload = ({ uploadResource }: ResourceUploadProps) => {
  const [isAddMenuDisplayed, setIsAddMenuDisplayed] = useState(false)
  const [uploadAreaDisplayed, setUploadAreaDisplayed] = useState('')

  const closeAddMenu = () => setIsAddMenuDisplayed(false)
  const displayDropArea = (type: string) => {
    closeAddMenu()
    setUploadAreaDisplayed(type)
  }

  const closeEditMode = () => {
    setUploadAreaDisplayed('')
  }

  const onSubmitImage = (title: string, fileToUpload: FileObject) => {
    uploadResource({
      name: fileToUpload.file.name,
      type: fileToUpload.file.type,
      data: fileToUpload.data as string,
      title,
    })
    closeEditMode()
  }
  const onSubmitVideo = (title: string, fileToUpload: FileObject, source: string, authors: string[]) => {
    uploadResource({
      name: fileToUpload.file.name,
      type: fileToUpload.file.type,
      data: fileToUpload.data as string,
      title,
      source,
      authors,
    })
    closeEditMode()
  }
  const onSubmitAudio = (
    title: string,
    fileToUpload: FileObject,
    album: string,
    authors: string[],
    audioType: AudioType,
  ) => {
    uploadResource({
      name: fileToUpload.file.name,
      type: fileToUpload.file.type,
      data: fileToUpload.data as string,
      title,
      album,
      authors,
      audioType,
    })
    closeEditMode()
  }

  const onSubmitSongPartition = (title: string, fileToUpload: FileObject, authors: string[]) => {
    uploadResource({
      name: fileToUpload.file.name,
      type: fileToUpload.file.type,
      data: fileToUpload.data as string,
      title,
      authors,
    })
    closeEditMode()
  }

  const onSubmitOrchestralPartition = (title: string, fileToUpload: FileObject, composers: string[], arrangers: string[], instruments: string[]) => {
    uploadResource({
      name: fileToUpload.file.name,
      type: fileToUpload.file.type,
      data: fileToUpload.data as string,
      title,
      composers,
      arrangers,
      instruments,
    })
    closeEditMode()
  }

  return <ResourceUploadDisplay displayAddImage={() => displayDropArea('image')}
                                displayAddVideo={() => displayDropArea('video')}
                                displayAddAudio={() => displayDropArea('audio')}
                                displayAddSongPartition={() => displayDropArea('song-partition')}
                                displayAddOrchestralPartition={() => displayDropArea('orchestral-partition')}
                                uploadAreaDisplayed={uploadAreaDisplayed}
                                isAddMenuDisplayed={isAddMenuDisplayed}
                                closeAddMenu={closeAddMenu}
                                closeEditMode={closeEditMode}
                                openAddMenu={() => setIsAddMenuDisplayed(true)}
                                onSubmitImage={onSubmitImage}
                                onSubmitVideo={onSubmitVideo}
                                onSubmitAudio={onSubmitAudio}
                                onSubmitSongPartition={onSubmitSongPartition}
                                onSubmitOrchestralPartition={onSubmitOrchestralPartition}
  />
}


type ResourceUploadDisplayProps = {
  displayAddImage: () => void;
  displayAddVideo: () => void;
  displayAddAudio: () => void;
  displayAddSongPartition: () => void;
  displayAddOrchestralPartition: () => void;
  uploadAreaDisplayed: string;
  isAddMenuDisplayed: boolean;
  closeAddMenu: () => void;
  closeEditMode: () => void;
  openAddMenu: () => void;
  onSubmitImage: (title: string, file: FileObject) => void;
  onSubmitVideo: (title: string, file: FileObject, source: string, authors: string[]) => void;
  onSubmitAudio: (
    title: string,
    fileToUpload: FileObject,
    album: string,
    authors: string[],
    audioType: AudioType,
  ) => void;
  onSubmitSongPartition: (title: string, file: FileObject, authors: string[]) => void;
  onSubmitOrchestralPartition: (title: string, file: FileObject, composers: string[], arrangers: string[], instruments: string[]) => void;
}
const ResourceUploadDisplay = ({
                                 displayAddImage,
                                 displayAddVideo,
                                 displayAddAudio,
                                 displayAddSongPartition,
                                 displayAddOrchestralPartition,
                                 uploadAreaDisplayed,
                                 isAddMenuDisplayed,
                                 closeAddMenu,
                                 closeEditMode,
                                 openAddMenu,
                                 onSubmitImage,
                                 onSubmitVideo,
                                 onSubmitAudio,
                                 onSubmitSongPartition,
                                 onSubmitOrchestralPartition,
                               }: ResourceUploadDisplayProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const onAddClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    openAddMenu()
  }

  const dropAreaImage = uploadAreaDisplayed === 'image' &&
      <ImageUpload onCancel={closeEditMode} onSubmit={onSubmitImage} />
  const dropAreaVideo = uploadAreaDisplayed === 'video' &&
      <VideoUpload onCancel={closeEditMode} onSubmit={onSubmitVideo} />
  const dropAreaAudio = uploadAreaDisplayed === 'audio' &&
      <AudioUpload onCancel={closeEditMode} onSubmit={onSubmitAudio} />
  const dropAreaSongPartition = uploadAreaDisplayed === 'song-partition' &&
      <SongPartitionUpload onCancel={closeEditMode} onSubmit={onSubmitSongPartition} />
  const dropAreaOrchestralPartition = uploadAreaDisplayed === 'orchestral-partition' &&
      <OrchestralPartitionUpload onCancel={closeEditMode} onSubmit={onSubmitOrchestralPartition} />

  return <div>
    <Button aria-controls='add' aria-haspopup='true' color='primary' onClick={onAddClick} data-add-resource>
      Add Resource
    </Button>
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={isAddMenuDisplayed}
      onClose={closeAddMenu}
    >
      <MenuItem onClick={displayAddImage} data-add-image-resource>Image</MenuItem>
      <MenuItem onClick={displayAddVideo} data-add-video-resource>Video</MenuItem>
      <MenuItem onClick={displayAddAudio} data-add-audio-resource>Audio</MenuItem>
      <MenuItem onClick={displayAddSongPartition} data-add-song-partition-resource>Song Partition</MenuItem>
      <MenuItem onClick={displayAddOrchestralPartition} data-add-orchestral-partition-resource>Orchestral Partition</MenuItem>
    </Menu>
    {dropAreaImage}
    {dropAreaVideo}
    {dropAreaAudio}
    {dropAreaSongPartition}
    {dropAreaOrchestralPartition}
  </div>
}