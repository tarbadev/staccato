import request from 'supertest'
import express, { Express } from 'express'
import { configureApp } from '../configuration'
import BundleService from '../application/BundleService'
import * as Utils from '../utils'
import Bundle from '../application/Bundle'
import Resource from '../application/Resource'
import BundleResponse from '@shared/Bundle'
import ResourceResponse from '@shared/Resource'

describe('BundleRouter', () => {
  const resource = new Resource(
    89,
    'My title rocks!',
    'image',
    'DriveId',
    '/path/to/resource/file',
    'https://example.com',
    ['First Author', 'Second Author'],
  )
  const resourceResponse: ResourceResponse = {
    id: 89,
    title: 'My title rocks!',
    url: '/path/to/resource/file',
    type: 'image',
    source: 'https://example.com',
    authors: ['First Author', 'Second Author'],
  }
  const bundle = new Bundle(32, 'Some super bundle', 'SuperDriveId', [resource])
  const bundleResponse: BundleResponse = { id: 32, name: 'Some super bundle', resources: [resourceResponse] }
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

  it('should call the BundleService on upload image', async () => {
    const filePath = '/path/to/temp/file'
    const someImageContent = 'Some Image Content'
    const uploadSpy = jest.spyOn(BundleService.prototype, 'upload')
    uploadSpy.mockResolvedValueOnce(bundle)

    const createTempFileFromBase64Spy = jest.spyOn(Utils, 'createTempFileFromBase64')
    createTempFileFromBase64Spy.mockReturnValueOnce(filePath)

    const base64Data = `data:image/png;base64,${btoa(someImageContent)}`
    const res = await request(app)
      .post(`/api/bundles/${bundle.id}/resources`)
      .send({ name: 'example.png', type: 'image/png', title: 'Super Title', data: base64Data })

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(bundleResponse)
    expect(createTempFileFromBase64Spy).toHaveBeenCalledWith(base64Data, 'example.png')
    expect(uploadSpy)
      .toHaveBeenCalledWith(bundle.id, { name: 'example.png', title: 'Super Title', type: 'image/png', filePath })
  })

  it('should call the BundleService on upload video', async () => {
    const title = 'Super Title'
    const filePath = '/path/to/temp/file'
    const fileName = 'example.png'
    const mimeType = 'video/mp4'
    const source = 'https://example.com'
    const authors = ['First Author', 'Second Author']
    const someVideoContent = 'Some Video Content'
    const uploadSpy = jest.spyOn(BundleService.prototype, 'upload')
    uploadSpy.mockResolvedValueOnce(bundle)

    const createTempFileFromBase64Spy = jest.spyOn(Utils, 'createTempFileFromBase64')
    createTempFileFromBase64Spy.mockReturnValueOnce(filePath)

    const base64Data = `data:${mimeType};base64,${btoa(someVideoContent)}`
    const res = await request(app)
      .post(`/api/bundles/${bundle.id}/resources`)
      .send({ name: fileName, type: mimeType, title, data: base64Data, source, authors })

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(bundleResponse)
    expect(createTempFileFromBase64Spy).toHaveBeenCalledWith(base64Data, 'example.png')
    expect(uploadSpy)
      .toHaveBeenCalledWith(bundle.id, { name: fileName, title, type: mimeType, filePath, source, authors })
  })
})