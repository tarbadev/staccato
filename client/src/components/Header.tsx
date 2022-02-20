import React from 'react'
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'

const useStyles = makeStyles(() => ({
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

  return <AppBar position='static' className={classes.root}>
    <Toolbar>
      <Typography variant='h6' className={classes.title} onClick={() => navigate('/')}>
        Staccato
      </Typography>
      <IconButton color='inherit' onClick={() => navigate('/settings')} data-menu-settings>
        <SettingsIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
}