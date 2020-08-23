import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Bundle from '@shared/Bundle'
import { request } from '../Utils'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { ExpressAdd } from '../components/ExpressAdd'

export const HomePage = () => {
  const [bundles, setBundles] = useState([])
  const history = useHistory()

  const loadBundles = () => {
    request({ url: '/api/bundles' })
      .then(data => setBundles(data))
  }

  const addBundle = (newBundleName: string, onSuccessCallback: () => void) => {
    request({ url: '/api/bundles', method: 'POST', body: { name: newBundleName } })
      .then(() => {
        onSuccessCallback()
        loadBundles()
      })
  }

  useEffect(loadBundles, [])

  return <HomePageDisplay
    bundles={bundles}
    displayBundleDetails={id => history.push(`/bundles/${id}`)}
    addBundle={addBundle}
  />
}

type HomePageProps = {
  bundles: Bundle[],
  displayBundleDetails: (id: number) => void,
  addBundle: (newBundleName: string, onSuccessCallback: () => void) => void,
}
const HomePageDisplay = ({ bundles, displayBundleDetails, addBundle }: HomePageProps) => {
  const bundlesToDisplay = bundles.map((bundle, index) =>
    <ListItem button key={`bundle-${index}`} onClick={() => displayBundleDetails(bundle.id)}>
      <ListItemText primary={bundle.name} data-bundle-name={bundle.name} primaryTypographyProps={{ variant: 'h6' }} />
    </ListItem>)

  return (
    <div id='home'>
      <ExpressAdd onSubmitCallback={addBundle} />
      <List>
        {bundlesToDisplay}
      </List>
    </div>
  )
}