import 'module-alias/register'
import 'reflect-metadata'
import express from 'express'
import { configureApp, configureDb, configureDrive } from './configuration'

const app = express()

configureDb()
  .then(configureDrive)
  .then(() => configureApp(app))
  .then(({ port, address }) => {
    app.listen(port, address, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on: ${address}:${port}`)
    })
  })
  // eslint-disable-next-line no-console
  .catch(error => console.log(`A problem happened while initializing server: \n${error}`))