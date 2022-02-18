import { AppBar } from '@material-ui/core'
import Toolbar from '@material-ui/core/Toolbar'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useNavigate } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    cursor: 'pointer',
  },
}))

export const Header = () => {
  const classes = useStyles()
  const navigate = useNavigate()

  return <AppBar position="static" className={classes.root}>
    <Toolbar>
      <Typography variant="h6" className={classes.title} onClick={() => navigate('/')}>
        Staccato
      </Typography>
      <IconButton color="inherit" onClick={() => navigate('/settings')} data-menu-settings>
        <SettingsIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
}