import request from 'supertest'
import express, { Express } from 'express'
import { configureApp } from '../configuration'
import BundleService from '../domain/BundleService'
import Bundle from '../domain/Bundle'
import BundleResponse from '@shared/Bundle'
import ResourceService from '../domain/ResourceService'
import { ResourceFactory, ResourceResponseFactory } from '../testFactory'

describe('ResourceRouter', () => {
  const resource = ResourceFactory({ id: 367 })
  const resourceResponse = ResourceResponseFactory({ id: 367 })
  const bundle = new Bundle(32, 'Some super bundle', 'SuperDriveId', [resource])
  const bundleResponse: BundleResponse = {
    id: 32,
    name: 'Some super bundle',
    driveUrl: `https://drive.google.com/drive/folders/${bundle.googleDriveId}`,
    resources: [resourceResponse],
  }
  let app: Express

  beforeAll(() => {
    app = express()
    configureApp(app)
  })

  it('should call the ResourceService on delete resource', async () => {
    const bundleId = 43
    const resourceId = 980

    const deleteResourceSpy = jest.spyOn(ResourceService.prototype, 'delete')
    const getBundleSpy = jest.spyOn(BundleService.prototype, 'get')
    deleteResourceSpy.mockResolvedValueOnce()
    getBundleSpy.mockResolvedValueOnce(bundle)

    const res = await request(app)
      .delete(`/api/bundles/${bundleId}/resources/${resourceId}`)

    expect(deleteResourceSpy).toHaveBeenCalledWith(resourceId)
    expect(getBundleSpy).toHaveBeenCalledWith(bundleId)

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(bundleResponse)
  })
})