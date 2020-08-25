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
import { DropzoneArea, FileObject } from 'material-ui-dropzone'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardHeader from '@material-ui/core/CardHeader'

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

  const uploadFiles = (fileObject: FileObject, title: string) => {
    request({
      url: `/api/bundles/${match.params.id}/resources`,
      method: 'POST',
      body: { name: fileObject.file.name, type: fileObject.file.type, data: fileObject.data, title },
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
    uploadFiles={uploadFiles}
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
  uploadFiles: (file: FileObject, title: string) => void,
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
                                   uploadFiles,
                                 }: BundleDetailPageProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isAddImageDisplayed, setIsAddImageDisplayed] = useState(false)
  const [fileUpload, setFileUpload] = useState<FileObject>()
  const [submitEnabled, setSubmitEnabled] = useState(false)
  const [imageTitle, setImageTitle] = useState('')
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

  const maxFileSize = 1024 * 1024 * 10

  const closeEditMode = () => setIsAddImageDisplayed(false)
  const onSubmit = () => {
    if (fileUpload) {
      uploadFiles(fileUpload, imageTitle)
    }
    closeEditMode()
  }
  const dropAreaImage = isAddImageDisplayed && <div data-add-image-container>
    <TextField
        fullWidth={true}
        value={imageTitle}
        onChange={({ target }) => setImageTitle(target.value)}
        label='Title'
        data-add-image-title
    />
    <DropzoneArea
        acceptedFiles={['image/*']}
        maxFileSize={maxFileSize}
        showPreviews={false}
        showPreviewsInDropzone={true}
        showFileNamesInPreview={true}
        onChange={(files) => {
          if (files[0]) {
            const reader = new FileReader()

            reader.addEventListener('load', function () {
              // convert image file to base64 string
              setFileUpload({ data: reader.result, file: files[0] })
              setSubmitEnabled(true)
            }, false)

            reader.readAsDataURL(files[0])
          } else {
            setSubmitEnabled(false)
          }
        }}
        inputProps={{ role: 'input' }}
        filesLimit={1}
    />
    <Grid
        container
        direction='row'
        justify='flex-end'
        alignItems='center'
    >
      <Button variant='outlined' onClick={closeEditMode}>Cancel</Button>
      <Button variant='outlined' color='primary' disabled={!submitEnabled} onClick={onSubmit}
              data-button-submit>Submit</Button>
    </Grid>
  </div>

  const resources = bundle.resources.map(resource => <Grid item key={resource.id}>
      <Card>
        {resource.title && <CardHeader title={resource.title} data-image-resource-title />}
        <CardMedia
          component='img'
          image={resource.url}
          title={resource.title}
        />
      </Card>
    </Grid>,
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
    </Menu>
    {dropAreaImage}
    <Grid container spacing={2} alignItems='stretch' direction='row' data-resource-container>
      {resources}
    </Grid>
  </div>)
}