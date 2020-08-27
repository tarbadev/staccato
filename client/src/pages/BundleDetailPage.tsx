import React, { useEffect, useState } from 'react'
import { Typography } from '@material-ui/core'
import { RouteComponentProps } from 'react-router'
import Bundle from '@shared/Bundle'
import { request } from '../Utils'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { FileObject } from 'material-ui-dropzone'
import Grid from '@material-ui/core/Grid'
import { ImageUpload } from '../components/ImageUpload'
import { VideoUpload } from '../components/VideoUpload'
import { ImageCard } from '../components/ImageCard'
import { VideoCard } from '../components/VideoCard'

interface RouteInfo {
  id: string;
}

export const BundleDetailPage = ({ match }: RouteComponentProps<RouteInfo>) => {
  const [bundle, setBundle] = useState<Bundle>({ id: 0, name: '', resources: [] })
  const [editMode, setEditMode] = useState(false)
  const [editBundleName, setEditBundleName] = useState('')
  const [isAddMenuDisplayed, setIsAddMenuDisplayed] = useState(false)

  useEffect(() => {
    request({ url: `/api/bundles/${match.params.id}` })
      .then(data => {
        setBundle(data)
        setEditBundleName(data.name)
      })
  }, [match.params.id])

  const editBundle = () => {
    request({ url: `/api/bundles/${bundle.id}`, method: 'POST', body: { name: editBundleName } })
      .then(data => {
        setEditMode(false)
        setBundle(data)
      })
  }

  const closeAddMenu = () => setIsAddMenuDisplayed(false)

  const uploadImage = (fileObject: FileObject, title: string) => {
    request({
      url: `/api/bundles/${match.params.id}/resources`,
      method: 'POST',
      body: { name: fileObject.file.name, type: fileObject.file.type, data: fileObject.data, title },
    })
      .then((bundle: Bundle) => setBundle(bundle))
      .catch(err => console.error('An error happened while uploading resources', err))
  }

  const uploadVideo = (fileObject: FileObject, title: string, source: string, authors: string[]) => {
    request({
      url: `/api/bundles/${match.params.id}/resources`,
      method: 'POST',
      body: { name: fileObject.file.name, type: fileObject.file.type, data: fileObject.data, title, source, authors },
    })
      .then((bundle: Bundle) => setBundle(bundle))
      .catch(err => console.error('An error happened while uploading resources', err))
  }

  return <BundleDetailPageDisplay
    bundle={bundle}
    editMode={editMode}
    editBundle={editBundle}
    toggleEditMode={() => setEditMode(true)}
    editBundleName={editBundleName}
    onBundleNameChange={setEditBundleName}
    isAddMenuDisplayed={isAddMenuDisplayed}
    openAddMenu={() => setIsAddMenuDisplayed(true)}
    closeAddMenu={closeAddMenu}
    uploadImage={uploadImage}
    uploadVideo={uploadVideo}
  />
}

type BundleDetailPageProps = {
  bundle: Bundle,
  editMode: boolean,
  editBundle: () => void,
  toggleEditMode: () => void,
  editBundleName: string,
  onBundleNameChange: (newName: string) => void,
  isAddMenuDisplayed: boolean,
  openAddMenu: () => void,
  closeAddMenu: () => void,
  uploadImage: (file: FileObject, title: string) => void,
  uploadVideo: (file: FileObject, title: string, source: string, authors: string[]) => void,
}
const BundleDetailPageDisplay = ({
                                   bundle,
                                   editMode,
                                   editBundle,
                                   editBundleName,
                                   onBundleNameChange,
                                   toggleEditMode,
                                   isAddMenuDisplayed,
                                   closeAddMenu,
                                   openAddMenu,
                                   uploadImage,
                                   uploadVideo,
                                 }: BundleDetailPageProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isAddImageDisplayed, setIsAddImageDisplayed] = useState(false)
  const [isAddVideoDisplayed, setIsAddVideoDisplayed] = useState(false)
  let title
  if (editMode) {
    title = (<form onSubmit={editBundle}>
      <TextField
        label='Name'
        value={editBundleName}
        onChange={({ target }) => onBundleNameChange(target.value)}
        data-new-bundle-name />
      <Button variant='contained' color='primary' onClick={editBundle} data-submit-bundle>
        Submit
      </Button>
    </form>)
  } else {
    title = (
      <Grid
        container
        direction='row'
        justify='flex-start'
        alignItems='center'
      >
        <Typography variant='h3' data-bundle-name={bundle.name}>{bundle.name}</Typography>
        <IconButton color='primary' aria-label='edit' onClick={toggleEditMode} data-edit-bundle-name>
          <EditIcon />
        </IconButton>
      </Grid>)
  }

  const onAddClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    openAddMenu()
  }

  const displayAddImage = () => {
    closeAddMenu()
    setIsAddImageDisplayed(true)
  }

  const displayAddVideo = () => {
    closeAddMenu()
    setIsAddVideoDisplayed(true)
  }

  const closeEditMode = () => setIsAddImageDisplayed(false)
  const onSubmitImage = (title: string, fileToUpload: FileObject) => {
    uploadImage(fileToUpload, title)
    closeEditMode()
  }
  const onSubmitVideo = (title: string, fileToUpload: FileObject, source: string, authors: string[]) => {
    uploadVideo(fileToUpload, title, source, authors)
    closeEditMode()
  }
  const dropAreaImage = isAddImageDisplayed && <ImageUpload onCancel={closeEditMode} onSubmit={onSubmitImage} />
  const dropAreaVideo = isAddVideoDisplayed && <VideoUpload onCancel={closeEditMode} onSubmit={onSubmitVideo} />

  const resources = bundle.resources.map(resource => {
      let card

      if (resource.type === 'image') {
        card = <ImageCard resource={resource} />
      } else if (resource.type === 'video') {
        card = <VideoCard resource={resource} />
      }


      return <Grid item key={resource.id}>
        {card}
      </Grid>
    },
  )

  return (<div id='bundle-detail'>
    {title}
    <Button aria-controls="add" aria-haspopup="true" color='primary' onClick={onAddClick} data-add-resource>
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
    </Menu>
    {dropAreaImage}
    {dropAreaVideo}
    <Grid container spacing={2} alignItems='stretch' direction='row' data-resource-container>
      {resources}
    </Grid>
  </div>)
}