import React, { useEffect, useState } from 'react'
import { Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

import Bundle from './Bundle'

export const HomePage = () => {
  const [bundles, setBundles] = useState([])
  const history = useHistory()

  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(data => setBundles(data))
  }, [])

  const welcomeMessagesToDisplay = bundles.map((bundle: Bundle, index) =>
    <Typography key={`welcome-${index}`}
                variant='h4'
                data-bundle-name={bundle.name}
                onClick={() => history.push(`/bundles/${bundle.id}`)}>
      {bundle.name}
    </Typography>)
  return (
    <div id="home">
      {welcomeMessagesToDisplay}
    </div>
  )
}