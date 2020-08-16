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

  it('should call the application bundle on get', async () => {
    const bundles = [{ id: 32, name: 'Some super bundle' }]

    jest
      .spyOn(BundleService.prototype, 'list')
      .mockImplementation(() => Promise.resolve(bundles))

    const res = await request(app).get('/api')

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(bundles)
  })
})