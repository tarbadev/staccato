import { Switch, Route } from 'react-router-dom'
import React from 'react'
import { HomePage } from '../pages/HomePage'
import { BundleDetailPage } from '../pages/BundleDetailPage'
import { SettingsPage } from '../pages/SettingsPage'

export const Content = () => {
  return <Switch>
    <Route exact path='/' component={HomePage}/>
    <Route exact path='/bundles/:id' component={BundleDetailPage}/>
    <Route exact path='/settings' component={SettingsPage}/>
  </Switch>
}