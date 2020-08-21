import 'module-alias/register'
import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'
import cfEnv from 'cfenv'
import { configureApp } from './configuration'
import ormConfig from '@config/base.orm.config'
import localDbCredentials from '@config/local.database.config'
import DbCredentials from '@shared/DbCredentials'
import GoogleDrive from './infrastructure/GoogleDrive'
import path from 'path'

const PORT = process.env.PORT || 4000

const app = express()

const appEnv = cfEnv.getAppEnv()

let dbCredentials: DbCredentials
if (appEnv.isLocal) {
  appEnv.port = Number(PORT)
  dbCredentials = localDbCredentials as DbCredentials
} else {

  dbCredentials = appEnv.getServiceCreds('staccato-db') as DbCredentials
}
const dbOptions = {
  ...ormConfig,
  'host': dbCredentials.hostname,
  'port': dbCredentials.port,
  'username': dbCredentials.username,
  'password': dbCredentials.password,
  'database': dbCredentials.name,
}

const driveCredentialsPath = path.join(__dirname, '../../config/drive-credentials.json')

createConnection(dbOptions as ConnectionOptions)
  .then(() => GoogleDrive.initialize(driveCredentialsPath))
  .then(() => configureApp(app))
  // eslint-disable-next-line no-console
  .catch(error => console.log(`Error while initializing server: ${error}`))

app.listen(appEnv.port, appEnv.bind, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on: ${appEnv.port}`)
})