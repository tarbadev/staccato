import 'module-alias/register'
import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'
import { configureApp } from './configuration'
import ormConfig from '@config/orm.config'

const PORT = process.env.PORT || 4000

const app = express()

createConnection(ormConfig as ConnectionOptions)
  .then(() => configureApp(app))
  // tslint:disable-next-line:no-console
  .catch(error => console.log(`Error while connecting to DB: ${error}`))

app.listen(PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server is running on: ${PORT}`)
})