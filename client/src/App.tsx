import React, { useEffect, useState } from 'react'
import Bundle from './Bundle'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Container from '@material-ui/core/Container'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}))

export const App = () => {
  const [bundles, setBundles] = useState([])
  const classes = useStyles()

  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(data => setBundles(data))
  }, [])

  const welcomeMessagesToDisplay = bundles.map((bundle: Bundle, index) =>
    <Typography key={`welcome-${index}`} variant='h4' data-bundle-name=''>{bundle.name}</Typography>)
  return (
    <main className={classes.content}>
      <Container maxWidth='xl' className={classes.container}>
        <div id="home">
          {welcomeMessagesToDisplay}
        </div>
      </Container>
    </main>
  )
}