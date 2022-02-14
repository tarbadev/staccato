import React, { useEffect, useState } from 'react'
import { Typography } from '@material-ui/core'
import { RouteComponentProps } from 'react-router'
import Bundle from '@shared/Bundle'
import { request } from '../Utils'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { ImageCard } from '../components/ImageCard'
import { VideoCard } from '../components/VideoCard'
import { AudioCard } from '../components/AudioCard'
import { UploadRequest } from '@shared/UploadRequest'
import { ResourceUpload } from '../components/ResourceUpload'
import { SongPartitionCard } from '../components/SongPartitionCard'
import { OrchestralPartitionCard } from '../components/OrchestralPartitionCard'

interface RouteInfo {
  id: string;
}

export const BundleDetailPage = ({ match }: RouteComponentProps<RouteInfo>) => {
  const [bundle, setBundle] = useState<Bundle>({ id: 0, name: '', driveUrl: '', resources: [] })
  const [editMode, setEditMode] = useState(false)
  const [editBundleName, setEditBundleName] = useState('')

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

  const uploadResource = (uploadRequest: UploadRequest) => {
    request({
      url: `/api/bundles/${match.params.id}/resources`,
      method: 'POST',
      body: uploadRequest,
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
    uploadResource={uploadResource}
  />
}

type BundleDetailPageProps = {
  bundle: Bundle,
  editMode: boolean,
  editBundle: () => void,
  toggleEditMode: () => void,
  editBundleName: string,
  onBundleNameChange: (newName: string) => void,
  uploadResource: (request: UploadRequest) => void;
}
const BundleDetailPageDisplay = ({
                                   bundle,
                                   editMode,
                                   editBundle,
                                   editBundleName,
                                   onBundleNameChange,
                                   toggleEditMode,
                                   uploadResource,
                                 }: BundleDetailPageProps) => {
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


  const resources = bundle.resources.map(resource => {
      let card
      const deleteResourceUrl = `/api/bundles/${bundle.id}/resources/${resource.id}`
      const onDeleteClick = () => request({ url: deleteResourceUrl, method: 'DELETE' })

      if (resource.type === 'image') {
        card = <ImageCard resource={resource} onDeleteClick={onDeleteClick} />
      } else if (resource.type === 'video') {
        card = <VideoCard resource={resource} onDeleteClick={onDeleteClick} />
      } else if (resource.type === 'audio') {
        card = <AudioCard resource={resource} onDeleteClick={onDeleteClick} />
      } else if (resource.type === 'song-partition') {
        card = <SongPartitionCard resource={resource} onDeleteClick={onDeleteClick} />
      } else if (resource.type === 'orchestral-partition') {
        card = <OrchestralPartitionCard resource={resource} onDeleteClick={onDeleteClick} />
      }

      return <Grid item key={resource.id}>
        {card}
      </Grid>
    },
  )

  return (<div id='bundle-detail'>
    {title}
    <ResourceUpload uploadResource={uploadResource} />
    <Grid container spacing={2} alignItems='stretch' direction='row' data-resource-container>
      <Grid item xs={12}>
        <Button data-view-in-drive variant='contained' color='primary' target='_blank' href={bundle.driveUrl}>View in
          Drive</Button>
      </Grid>
      {resources}
    </Grid>
  </div>)
}