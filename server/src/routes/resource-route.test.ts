import request from 'supertest'
import express, { Express } from 'express'
import { configureApp } from '../configuration'
import BundleService from '../domain/BundleService'
import Bundle from '../domain/Bundle'
import Resource from '../domain/Resource'
import BundleResponse from '@shared/Bundle'
import ResourceResponse from '@shared/Resource'
import ResourceService from '../domain/ResourceService'

describe('ResourceRouter', () => {
  const resource = new Resource(
    89,
    'My title rocks!',
    'image',
    'DriveId',
    '/path/to/resource/file',
    'https://example.com',
    ['First Author', 'Second Author'],
    'Some Super Hit Album',
    'song',
    ['First Composer', 'Second Composer'],
    ['First Arranger', 'Second Arranger'],
    ['Piano', 'Violin', 'Trumpet'],
  )
  const resourceResponse: ResourceResponse = {
    id: 89,
    title: 'My title rocks!',
    url: '/path/to/resource/file',
    type: 'image',
    source: 'https://example.com',
    authors: ['First Author', 'Second Author'],
    album: 'Some Super Hit Album',
    audioType: 'song',
    composers: ['First Composer', 'Second Composer'],
    arrangers: ['First Arranger', 'Second Arranger'],
    instruments: ['Piano', 'Violin', 'Trumpet'],
  }
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