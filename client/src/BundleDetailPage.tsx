import React, { useEffect, useState } from 'react'
import { Typography } from '@material-ui/core'
import { RouteComponentProps } from 'react-router'
import Bundle from '@shared/Bundle'
import { request } from './Utils'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

interface RouteInfo {
  id: string;
}

export const BundleDetailPage = ({ match }: RouteComponentProps<RouteInfo>) => {
  const [bundle, setBundle] = useState<Bundle>({ id: 0, name: '' })
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

  return <BundleDetailPageDisplay
    bundle={bundle}
    editMode={editMode}
    editBundle={editBundle}
    toggleEditMode={() => setEditMode(true)}
    editBundleName={editBundleName}
    onBundleNameChange={setEditBundleName}
  />
}

type BundleDetailPageProps = {
  bundle: Bundle,
  editMode: boolean,
  editBundle: () => void,
  toggleEditMode: () => void,
  editBundleName: string,
  onBundleNameChange: (newName: string) => void,
}
const BundleDetailPageDisplay = ({ bundle, editMode, editBundle, editBundleName, onBundleNameChange, toggleEditMode }: BundleDetailPageProps) => {
  let title
  if (editMode) {
    title = (<form onSubmit={editBundle}>
      <TextField
        label='Name'
        value={editBundleName}
        onChange={({ target }) => onBundleNameChange(target.value)}
        data-new-bundle-name/>
      <Button variant='contained' color='primary' onClick={editBundle} data-submit-bundle>
        Submit
      </Button>
    </form>)
  } else {
    title = (<div>
      <Typography variant='h3' data-bundle-name={bundle.name}>{bundle.name}</Typography>
      <IconButton color='primary' aria-label='edit' onClick={toggleEditMode} data-edit-bundle-name>
        <EditIcon/>
      </IconButton>
    </div>)
  }

  return <div id='bundle-detail'>
    {title}
  </div>
}