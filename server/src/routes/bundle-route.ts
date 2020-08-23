import express, { Request, Response } from 'express'
import BundleService from '../application/BundleService'
import { createTempFileFromBase64 } from '../utils'

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

bundleRouter.post('/:id/resources', async (req: Request, res: Response) => {
  const filePath = createTempFileFromBase64(req.body.data, req.body.name)
  res.json(
    await bundleService.upload(
      Number(req.params.id),
      { name: req.body.name, title: req.body.title, type: req.body.type, filePath },
    ),
  )
})

export default bundleRouter