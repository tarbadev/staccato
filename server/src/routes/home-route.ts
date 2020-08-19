import express, { Request, Response } from 'express'
import BundleService from '../application/BundleService'

const homeRouter = express.Router()

const bundleService = new BundleService()

homeRouter.get('/', async (req: Request, res: Response) => {
  res.json(await bundleService.list())
})

homeRouter.post('/', async (req: Request, res: Response) => {
  const newBundle = await bundleService.add(req.body.name)
  res.json(newBundle)
})

homeRouter.get('/:id', async (req: Request, res: Response) => {
  res.json(await bundleService.get(Number(req.params.id)))
})

homeRouter.post('/:id', async (req: Request, res: Response) => {
  res.json(await bundleService.edit(Number(req.params.id), req.body.name))
})

export default homeRouter