import express, { Request, Response } from 'express'
import BundleService from '../domain/BundleService'
import BundleResponse from '@shared/Bundle'
import { mapBundleToResponse } from './route-mapper'

const bundleRouter = express.Router()

const bundleService = new BundleService()

bundleRouter.get('/', async (req: Request, res: Response<BundleResponse[]>) => {
  const bundles = await bundleService.list()
  res.json(bundles.map(mapBundleToResponse))
})

bundleRouter.post('/', async (req: Request, res: Response<BundleResponse>) => {
  const newBundle = await bundleService.add(req.body.name)
  res.json(mapBundleToResponse(newBundle))
})

bundleRouter.get('/:id', async (req: Request, res: Response<BundleResponse>) => {
  res.json(mapBundleToResponse(await bundleService.get(Number(req.params.id))))
})

bundleRouter.post('/:id', async (req: Request, res: Response<BundleResponse>) => {
  res.json(mapBundleToResponse(await bundleService.edit(Number(req.params.id), req.body.name)))
})

export default bundleRouter