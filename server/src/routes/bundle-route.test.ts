import request from 'supertest'
import express, { Express } from 'express'
import { configureApp } from '../configuration'
import BundleService from '../application/BundleService'

describe('BundleRouter', () => {
  const bundle = { id: 32, name: 'Some super bundle', googleDriveId: 'SuperDriveId' }
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
    expect(res.body).toEqual(bundles)
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
    expect(res.body).toEqual(bundle)
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
      .send({name: bundle.name})

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(bundle)
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
      .send({name: bundle.name})

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(bundle)
  })
})