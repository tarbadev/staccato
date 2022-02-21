import request from 'supertest'
import express, { Express } from 'express'
import { configureApp } from '../configuration'
import BundleService from '../domain/BundleService'
import * as Utils from '../utils'
import Bundle from '../domain/Bundle'
import Resource from '../domain/Resource'
import BundleResponse from '@shared/Bundle'
import ResourceResponse, { AudioType } from '@shared/Resource'

describe('BundleRouter', () => {
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

  it('should call the BundleService on get all', async () => {
    const bundles = [bundle]

    jest
      .spyOn(BundleService.prototype, 'list')
      .mockImplementation(() => Promise.resolve(bundles))

    const res = await request(app).get('/api/bundles')

    expect(res.status).toEqual(200)
    expect(res.body).toEqual([bundleResponse])
  })

  it('should call the BundleService on get one', async () => {
    jest
      .spyOn(BundleService.prototype, 'get')
      .mockImplementation((id) => {
        expect(id).toBe(bundle.id)

        return Promise.resolve(bundle)
      })

    const res = await request(app).get(`/api/bundles/${bundle.id}`)

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(bundleResponse)
  })

  it('should call the BundleService on add', async () => {
    jest
      .spyOn(BundleService.prototype, 'add')
      .mockImplementation((name) => {
        expect(name).toBe(bundle.name)

        return Promise.resolve(bundle)
      })

    const res = await request(app)
      .post('/api/bundles')
      .send({ name: bundle.name })

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(bundleResponse)
  })

  it('should call the BundleService on edit', async () => {
    jest
      .spyOn(BundleService.prototype, 'edit')
      .mockImplementation((id, name) => {
        expect(id).toBe(bundle.id)
        expect(name).toBe(bundle.name)

        return Promise.resolve(bundle)
      })

    const res = await request(app)
      .post(`/api/bundles/${bundle.id}`)
      .send({ name: bundle.name })

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

  it('should call the BundleService on delete resource', async () => {
    const bundleId = 43
    const resourceId = 980

    const deleteSpy = jest.spyOn(BundleService.prototype, 'deleteResource')
    deleteSpy.mockResolvedValueOnce(bundle)

    const res = await request(app)
      .delete(`/api/bundles/${bundleId}/resources/${resourceId}`)

    expect(deleteSpy).toHaveBeenCalledWith(bundleId, resourceId)

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(bundleResponse)
  })
})