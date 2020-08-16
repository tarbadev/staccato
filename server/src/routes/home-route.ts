import express, { Request, Response } from 'express'
import BundleService from '../application/BundleService'

const homeRouter = express.Router()

const bundleService = new BundleService()

homeRouter.get('/', async (req: Request, res: Response) => {
  res.json(await bundleService.list())
})

homeRouter.get('/:id', async (req: Request, res: Response) => {
  res.json(await bundleService.get(Number(req.params.id)))
})

export default homeRouter