import { Route, Routes } from 'react-router-dom'
import React from 'react'
import { HomePage } from '../pages/HomePage'
import { BundleDetailPage } from '../pages/BundleDetailPage'
import { SettingsPage } from '../pages/SettingsPage'

export const Content = () => {
  return <Routes>
    <Route path='/' element={<HomePage />} />
    <Route path='/bundles/:id' element={<BundleDetailPage />} />
    <Route path='/settings' element={<SettingsPage />} />
  </Routes>
}