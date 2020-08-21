import { Switch, Route } from 'react-router-dom'
import React from 'react'
import { HomePage } from './HomePage'
import { BundleDetailPage } from './BundleDetailPage'
import { SettingsPage } from './SettingsPage'

export const Content = () => {
  return <Switch>
    <Route exact path='/' component={HomePage}/>
    <Route exact path='/bundles/:id' component={BundleDetailPage}/>
    <Route exact path='/settings' component={SettingsPage}/>
  </Switch>
}