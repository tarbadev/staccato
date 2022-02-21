import request from 'supertest'
import express, { Express } from 'express'
import { configureApp } from '../configuration'
import SettingsService from '../domain/SettingsService'

describe('SettingsRouter', () => {
  const authorizedUser = { email: 'test@example.com' }
  let app: Express

  beforeAll(() => {
    app = express()
    configureApp(app)
  })

  it('should call the SettingsService on get all authorized users', async () => {
    const authorizedUsers = [authorizedUser]

    jest
      .spyOn(SettingsService.prototype, 'listAuthorizedUsers')
      .mockImplementation(() => Promise.resolve(authorizedUsers))

    const res = await request(app).get('/api/settings/authorizedUsers')

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(authorizedUsers)
  })

  it('should call the SettingsService on add authorized user', async () => {
    jest
      .spyOn(SettingsService.prototype, 'addAuthorizedUser')
      .mockImplementation((name) => {
        expect(name).toBe(authorizedUser.email)

        return Promise.resolve(authorizedUser)
      })

    const res = await request(app)
      .post('/api/settings/authorizedUsers')
      .send({ email: authorizedUser.email })

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(authorizedUser)
  })
})