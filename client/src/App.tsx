import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Container from '@material-ui/core/Container'
import { Content } from './Content'

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
  const classes = useStyles()

  return (
    <main className={classes.content}>
      <Container maxWidth='md' className={classes.container}>
        <Content/>
      </Container>
    </main>
  )
}