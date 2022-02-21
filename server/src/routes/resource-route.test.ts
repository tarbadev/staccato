import request from 'supertest'
import express, { Express } from 'express'
import { configureApp } from '../configuration'
import BundleService from '../domain/BundleService'
import Bundle from '../domain/Bundle'
import BundleResponse from '@shared/Bundle'
import ResourceService from '../domain/ResourceService'
import { ResourceFactory, ResourceResponseFactory } from '../testFactory'
import { AudioType } from '@shared/Resource'
import * as Utils from '../utils'

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

  describe('upload resource', () => {
    type UploadTestOptions = { title?: string; source?: string; authors?: string[]; composers?: string[]; arrangers?: string[]; instruments?: string[]; album?: string; audioType?: AudioType }
    const testUpload = async (fileName: string, mimeType: string, options: UploadTestOptions): Promise<void> => {
      const filePath = '/path/to/temp/file'
      const someFileContent = 'Some File Content'
      const uploadSpy = jest.spyOn(BundleService.prototype, 'upload')
      uploadSpy.mockResolvedValueOnce(bundle)

      const createTempFileFromBase64Spy = jest.spyOn(Utils, 'createTempFileFromBase64')
      createTempFileFromBase64Spy.mockReturnValueOnce(filePath)

      const base64Data = `data:${mimeType};base64,${Buffer.from(someFileContent).toString('base64')}`
      const res = await request(app)
        .post(`/api/bundles/${bundle.id}/resources`)
        .send({ name: fileName, type: mimeType, data: base64Data, ...options })

      expect(res.status).toEqual(200)
      expect(res.body).toEqual(bundleResponse)
      expect(createTempFileFromBase64Spy).toHaveBeenCalledWith(base64Data, fileName)
      expect(uploadSpy)
        .toHaveBeenCalledWith(bundle.id, { name: fileName, type: mimeType, filePath, ...options })
    }

    it('should call the BundleService on upload image', async () => {
      await testUpload('example.png', 'image/png', { title: 'Super Title' })
    })

    it('should call the BundleService on upload video', async () => {
      await testUpload(
        'example.mp4',
        'video/mp4',
        { title: 'Super Title', source: 'https://example.com', authors: ['First Author', 'Second Author'] },
      )
    })

    it('should call the BundleService on upload music', async () => {
      await testUpload(
        'example.mp3',
        'audio/mp3',
        {
          title: 'Super Title',
          album: 'Super Hit Album',
          authors: ['First Author', 'Second Author'],
          audioType: 'song',
        },
      )
    })

    it('should call the BundleService on upload song partition', async () => {
      await testUpload(
        'example.pdf',
        'application/pdf',
        { title: 'Super Title', authors: ['First Author', 'Second Author'] },
      )
    })

    it('should call the BundleService on upload orchestral partition', async () => {
      await testUpload(
        'example.pdf',
        'application/pdf',
        {
          title: 'Super Title',
          composers: ['First Composer', 'Second Composer'],
          arrangers: ['First Arranger', 'Second Arranger'],
          instruments: ['Piano', 'Violin', 'Trumpet'],
        },
      )
    })
  })
})