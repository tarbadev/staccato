import express, { Request, Response } from 'express'
import BundleService, { UploadParams } from '../domain/BundleService'
import { createTempFileFromBase64 } from '../utils'
import BundleResponse from '@shared/Bundle'
import { mapBundleToResponse } from './route-mapper'
import ResourceService from '../domain/ResourceService'

const bundleRouter = express.Router()

const bundleService = new BundleService()
const resourceService = new ResourceService()

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

bundleRouter.post('/:id/resources', async (req: Request, res: Response<BundleResponse>) => {
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
  const bundle = await bundleService.upload(Number(req.params.id), uploadParams)
  res.json(mapBundleToResponse(bundle))
})

bundleRouter.delete('/:id/resources/:resourceId', async (req: Request, res: Response<BundleResponse>) => {
  const bundleId = Number(req.params.id)

  await resourceService.delete(Number(req.params.resourceId))

  const bundle = await bundleService.get(bundleId)

  res.json(mapBundleToResponse(bundle))
})

export default bundleRouter