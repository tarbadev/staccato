import request from 'supertest'
import express, { Express } from 'express'
import { configureApp } from '../configuration'
import BundleService from '../application/BundleService'

describe('HomeRouter', () => {
  let app: Express

  beforeAll(() => {
    app = express()
    configureApp(app)
  })

  it('should call the application bundle on get all', async () => {
    const bundles = [{ id: 32, name: 'Some super bundle' }]

    jest
      .spyOn(BundleService.prototype, 'list')
      .mockImplementation(() => Promise.resolve(bundles))

    const res = await request(app).get('/api/bundles')

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(bundles)
  })

  it('should call the application bundle on get one', async () => {
    const bundle = { id: 32, name: 'Some super bundle' }

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
})