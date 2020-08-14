import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import path from 'path'

import homeRouter from './routes/home-route'
import { expressCspHeader, INLINE, NONE, SELF } from 'express-csp-header'

const PORT = process.env.PORT || 4000
const app = express()

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(expressCspHeader({
  directives: {
    'default-src': [SELF],
    'script-src': [SELF, INLINE],
    'style-src': [SELF],
    'img-src': ['data:', SELF],
    'worker-src': [NONE],
    'block-all-mixed-content': true
  }
}));

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
  app.use(express.static(path.join(__dirname, 'frontend')))
}

app.use('/api', homeRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // tslint:disable-next-line:no-console
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server is running on: ${PORT}`)
})