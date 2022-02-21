import express, { Request, Response } from 'express'
import BundleResponse from '@shared/Bundle'
import ResourceResponse from '@shared/Resource'
import { mapBundleToResponse, mapResourceToResponse } from './route-mapper'
import ResourceService, { UploadParams } from '../domain/ResourceService'
import BundleService from '../domain/BundleService'
import { createTempFileFromBase64 } from '../utils'

const resourceRouter = express.Router({ mergeParams: true })

const bundleService = new BundleService()
const resourceService = new ResourceService()

resourceRouter.post('/', async (req: Request, res: Response<ResourceResponse>) => {
  const filePath = createTempFileFromBase64(req.body.data, req.body.name)
  const uploadParams: UploadParams = {
    filePath,
    name: req.body.name,
    type: req.body.type,
    title: req.body.title,
    source: req.body.source,
    authors: req.body.authors,
    composers: req.body.composers,
    arrangers: req.body.arrangers,
    instruments: req.body.instruments,
    album: req.body.album,
    audioType: req.body.audioType,
  }
  const bundle = await bundleService.get(Number(req.params.bundleId))
  const createdResource = await resourceService.upload(bundle, uploadParams)

  res.json(mapResourceToResponse(createdResource))
})

resourceRouter.delete('/:resourceId', async (req: Request, res: Response<BundleResponse>) => {
  await resourceService.delete(Number(req.params.resourceId))

  const bundle = await bundleService.get(Number(req.params.bundleId))

  res.json(mapBundleToResponse(bundle))
})

export default resourceRouter