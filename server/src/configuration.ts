import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { expressCspHeader, INLINE, NONE, SELF } from 'express-csp-header'
import path from 'path'
import bundleRouter from './routes/bundle-route'
import history from 'connect-history-api-fallback'
import { Connection, createConnection, ConnectionOptions } from 'typeorm'
import ormConfig from '@config/base.orm.config'
import DbCredentials from '@shared/DbCredentials'
import localDbCredentials from '@config/local.database.config'
import cfEnv from 'cfenv'

const appEnv = cfEnv.getAppEnv()

export const configureApp = (app: Express): [number, string] => {
  const port = process.env.PORT || 4000
  if (appEnv.isLocal) {
    appEnv.port = Number(port)
  }

  app.use(cors())
  app.use(helmet())
  app.use(compression())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(history({ verbose: false }))
  app.use(expressCspHeader({
    directives: {
      'default-src': [SELF, INLINE],
      'script-src': [SELF, INLINE],
      'style-src': [SELF, INLINE],
      'img-src': ['data:', SELF],
      'worker-src': [NONE],
      'block-all-mixed-content': true,
    },
  }))

  app.use('/api/bundles', bundleRouter)

  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
    const root = path.join(__dirname, '../../frontend')
    app.use(express.static(root))
  }

  app.use((err: Error, req: Request, res: Response) => {
    // eslint-disable-next-line no-console
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

  return [appEnv.port, appEnv.bind]
}

export const configureDb = (): Promise<Connection|void> => {
  let dbCredentials: DbCredentials
  if (appEnv.isLocal) {
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

  return createConnection(dbOptions as ConnectionOptions)
    // eslint-disable-next-line no-console
    .catch(err => console.error(`Error while initializing Database: ${err}`))
}