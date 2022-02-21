import express, { Request, Response } from 'express'
import BundleResponse from '@shared/Bundle'
import { mapBundleToResponse } from './route-mapper'
import ResourceService from '../domain/ResourceService'
import BundleService from '../domain/BundleService'

const resourceRouter = express.Router({ mergeParams: true })

const bundleService = new BundleService()
const resourceService = new ResourceService()

resourceRouter.delete('/:resourceId', async (req: Request, res: Response<BundleResponse>) => {
  await resourceService.delete(Number(req.params.resourceId))

  const bundle = await bundleService.get(Number(req.params.bundleId))

  res.json(mapBundleToResponse(bundle))
})

export default resourceRouter