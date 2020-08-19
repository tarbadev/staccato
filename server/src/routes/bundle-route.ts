import express, { Request, Response } from 'express'
import BundleService from '../application/BundleService'

const bundleRouter = express.Router()

const bundleService = new BundleService()

bundleRouter.get('/', async (req: Request, res: Response) => {
  res.json(await bundleService.list())
})

bundleRouter.post('/', async (req: Request, res: Response) => {
  const newBundle = await bundleService.add(req.body.name)
  res.json(newBundle)
})

bundleRouter.get('/:id', async (req: Request, res: Response) => {
  res.json(await bundleService.get(Number(req.params.id)))
})

bundleRouter.post('/:id', async (req: Request, res: Response) => {
  res.json(await bundleService.edit(Number(req.params.id), req.body.name))
})

export default bundleRouter