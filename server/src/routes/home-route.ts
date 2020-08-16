import express, { Request, Response } from 'express'
import BundleService from '../application/BundleService'

const homeRouter = express.Router()

const bundleService = new BundleService()

homeRouter.get('/', async (req: Request, res: Response) => {
  res.json(await bundleService.list())
})

export default homeRouter