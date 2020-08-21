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

export const configureApp = (app: Express): void => {
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
}