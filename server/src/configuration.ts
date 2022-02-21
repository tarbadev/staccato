import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { DATA, expressCspHeader, INLINE, NONE, SELF } from 'express-csp-header'
import path from 'path'
import bundleRouter from './routes/bundle-route'
import resourceRouter from './routes/resource-route'
import settingsRouter from './routes/settings-route'
import history from 'connect-history-api-fallback'
import { Connection, createConnection } from 'typeorm'
import localDbCredentials from '@config/local.database.config'
import { config as envDbCredentials } from '@config/env.database.config'
import GoogleDrive from './infrastructure/GoogleDrive'

export const configureApp = (app: Express): { port: number; address: string } => {
  const port = Number(process.env.PORT) || 4000
  const address = process.env.ADDRESS || '127.0.0.1'

  const uploadLimit = '10mb'

  app.use(cors())
  app.use(helmet())
  app.use(compression())
  app.use(express.json({ limit: uploadLimit }))
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(bodyParser.json({ limit: uploadLimit }))
  app.use(history({ verbose: false }))
  app.use(expressCspHeader({
    directives: {
      'default-src': [SELF, INLINE, DATA],
      'script-src': [SELF, INLINE],
      'style-src': [SELF, INLINE],
      'img-src': [DATA, SELF],
      'worker-src': [NONE],
      'block-all-mixed-content': true,
    },
  }))

  app.use('/api/bundles', bundleRouter)
  app.use('/api/bundles/:bundleId/resources', resourceRouter)
  app.use('/api/settings', settingsRouter)

  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
    const root = path.join(__dirname, '../../frontend')
    app.use(express.static(root))
  }

  app.use((err: Error, req: Request, res: Response) => {
    // eslint-disable-next-line no-console
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

  return { port, address }
}

export const configureDb = (): Promise<Connection | void> => {
  return createConnection(envDbCredentials || localDbCredentials)
    .catch(err => {
      throw new Error(`A problem happened while initializing Database: \n${err}`)
    })
}

export const configureDrive = (): Promise<void> => {
  const driveCredentialsPath = path.join(__dirname, '../../config/drive-credentials.json')

  return GoogleDrive.initialize(driveCredentialsPath)
    .catch(err => {
      throw new Error(`A problem happened while initializing Google Drive: \n${err}`)
    })
}