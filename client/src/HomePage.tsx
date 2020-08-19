import React, { useEffect, useState } from 'react'
import { Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

import Bundle from '@shared/Bundle'
import AddIcon from '@material-ui/icons/Add'
import Tooltip from '@material-ui/core/Tooltip'
import Fab from '@material-ui/core/Fab'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export const HomePage = () => {
  const [bundles, setBundles] = useState([])
  const [newBundleName, setNewBundleName] = useState('')
  const [displayAddBundleForm, setDisplayAddBundleForm] = useState(false)
  const history = useHistory()

  const loadBundles = () => {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    fetch('/api/bundles', {headers})
      .then(response => response.json())
      .then(data => setBundles(data))
  }

  const addBundle = () => {
    const body = { name: newBundleName }
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    fetch('/api/bundles', { method: 'POST', body: JSON.stringify(body), headers })
      .then(loadBundles)
  }

  useEffect(loadBundles, [])

  const bundlesToDisplay = bundles.map((bundle: Bundle, index) =>
    <Typography key={`bundle-${index}`}
                variant='h4'
                data-bundle-name={bundle.name}
                onClick={() => history.push(`/bundles/${bundle.id}`)}>
      {bundle.name}
    </Typography>)

  return (
    <div id='home'>
      <Tooltip title='Add' aria-label='add'>
        <Fab color='primary' onClick={() => setDisplayAddBundleForm(true)} data-add-bundle>
          <AddIcon/>
        </Fab>
      </Tooltip>
      {displayAddBundleForm &&
      <form onSubmit={addBundle}>
        <TextField
          label='Name'
          value={newBundleName}
          onChange={({ target }) => setNewBundleName(target.value)}
          data-new-bundle-name />
        <Button variant='contained' color='primary' onClick={addBundle} data-submit-bundle>
          Submit
        </Button>
      </form>
      }
      {bundlesToDisplay}
    </div>
  )
}