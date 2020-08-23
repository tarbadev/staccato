import React, { useEffect, useState } from 'react'
import { ExpressAdd } from './ExpressAdd'
import { request } from './Utils'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

export const SettingsPage = () => {
  const [authorizedUsers, setAuthorizedUsers] = useState([])

  const loadAuthorizedUsers = () => {
    request({ url: '/api/settings/authorizedUsers' })
      .then(data => setAuthorizedUsers(data))
  }

  const addAuthorizedUser = (newEmail: string, onSuccessCallback: () => void) => {
    request({ url: '/api/settings/authorizedUsers', method: 'POST', body: { email: newEmail } })
      .then(() => {
        onSuccessCallback()
        loadAuthorizedUsers()
      })
  }

  useEffect(loadAuthorizedUsers, [])

  return <SettingsPageDisplay addAuthorizedUser={addAuthorizedUser} authorizedUsers={authorizedUsers} />
}

type SettingsPageDisplayProps = {
  addAuthorizedUser: (email: string, onSuccessCallback: () => void) => void,
  authorizedUsers: { email: string }[],
}
const SettingsPageDisplay = ({ addAuthorizedUser, authorizedUsers }: SettingsPageDisplayProps) => {
  const usersToDisplay = authorizedUsers.map((user, index) =>
    <ListItem button key={`bundle-${index}`}>
      <ListItemText primary={user.email} data-authorized-user={user.email} primaryTypographyProps={{ variant: 'h6' }} />
    </ListItem>)

  return <div id='settings'>
    <ExpressAdd onSubmitCallback={addAuthorizedUser} />
    <List>
      {usersToDisplay}
    </List>
  </div>
}