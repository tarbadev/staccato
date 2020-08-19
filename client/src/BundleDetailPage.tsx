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

export const BundleDetailPage = (routeInfo: RouteComponentProps<RouteInfo>) => {
  const [bundle, setBundle] = useState<Bundle>({ id: 0, name: '' })
  const [editMode, setEditMode] = useState(false)
  const [editBundleName, setEditBundleName] = useState('')

  useEffect(() => {
    request({ url: `/api/bundles/${routeInfo.match.params.id}` })
      .then(data => {
        setBundle(data)
        setEditBundleName(data.name)
      })
  }, [routeInfo.match.params.id])

  const editBundle = () => {
    request({ url: `/api/bundles/${bundle.id}`, method: 'POST', body: { name: editBundleName } })
      .then(data => {
        setEditMode(false)
        setBundle(data)
      })
  }

  let title
  if (editMode) {
    title = (<form onSubmit={editBundle}>
      <TextField
        label='Name'
        value={editBundleName}
        onChange={({ target }) => setEditBundleName(target.value)}
        data-new-bundle-name/>
      <Button variant='contained' color='primary' onClick={editBundle} data-submit-bundle>
        Submit
      </Button>
    </form>)
  } else {
    title = (<div>
      <Typography variant='h3' data-bundle-name={bundle.name}>{bundle.name}</Typography>
      <IconButton color='primary' aria-label='edit' onClick={() => setEditMode(true)} data-edit-bundle-name>
        <EditIcon/>
      </IconButton>
    </div>)
  }

  return <div id='bundle-detail'>
    {title}
  </div>
}