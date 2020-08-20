import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Bundle from '@shared/Bundle'
import AddIcon from '@material-ui/icons/Add'
import Tooltip from '@material-ui/core/Tooltip'
import Fab from '@material-ui/core/Fab'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { request } from './Utils'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

export const HomePage = () => {
  const [bundles, setBundles] = useState([])
  const [newBundleName, setNewBundleName] = useState('')
  const [displayAddBundleForm, setDisplayAddBundleForm] = useState(false)
  const history = useHistory()

  const loadBundles = () => {
    request({ url: '/api/bundles' })
      .then(data => setBundles(data))
  }

  const addBundle = () => {
    request({ url: '/api/bundles', method: 'POST', body: { name: newBundleName } })
      .then(loadBundles)
  }

  useEffect(loadBundles, [])

  return <HomePageDisplay
    bundles={bundles}
    displayBundleDetails={id => history.push(`/bundles/${id}`)}
    displayAddBundleForm={() => setDisplayAddBundleForm(true)}
    addBundle={addBundle}
    newBundleName={newBundleName}
    onNewBundleNameChange={setNewBundleName}
    isEditMode={displayAddBundleForm}
  />
}

type HomePageProps = {
  bundles: Bundle[],
  displayBundleDetails: (id: number) => void,
  displayAddBundleForm: () => void,
  isEditMode: boolean,
  addBundle: () => void,
  newBundleName: string,
  onNewBundleNameChange: (newName: string) => void,
}
const HomePageDisplay = ({ bundles, displayBundleDetails, displayAddBundleForm, addBundle, newBundleName, onNewBundleNameChange, isEditMode }: HomePageProps) => {
  const bundlesToDisplay = bundles.map((bundle, index) =>
    <ListItem button key={`bundle-${index}`} onClick={() => displayBundleDetails(bundle.id)}>
      <ListItemText primary={bundle.name} data-bundle-name={bundle.name} primaryTypographyProps={{ variant: 'h6' }} />
    </ListItem>)

  return (
    <div id='home'>
      <Tooltip title='Add' aria-label='add'>
        <Fab color='primary' onClick={displayAddBundleForm} data-add-bundle>
          <AddIcon />
        </Fab>
      </Tooltip>
      {isEditMode &&
      <form onSubmit={addBundle}>
        <TextField
            label='Name'
            value={newBundleName}
            onChange={({ target }) => onNewBundleNameChange(target.value)}
            data-new-bundle-name />
        <Button variant='contained' color='primary' onClick={addBundle} data-submit-bundle>
          Submit
        </Button>
      </form>
      }
      <List>
        {bundlesToDisplay}
      </List>
    </div>
  )
}