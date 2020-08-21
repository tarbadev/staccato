import 'module-alias/register'
import 'reflect-metadata'
import express from 'express'
import { configureApp, configureDb } from './configuration'
import GoogleDrive from './infrastructure/GoogleDrive'
import path from 'path'

const app = express()
const driveCredentialsPath = path.join(__dirname, '../../config/drive-credentials.json')

configureDb()
  .then(() => GoogleDrive.initialize(driveCredentialsPath))
  .then(() => configureApp(app))
  .then(([port, address]) => {
    app.listen(port, address, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on: ${port}`)
    })
  })
  // eslint-disable-next-line no-console
  .catch(error => console.log(`Error while initializing server: ${error}`))