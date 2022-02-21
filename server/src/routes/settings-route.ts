import express, { Request, Response } from 'express'
import SettingsService from '../domain/SettingsService'

const settingsRouter = express.Router()

const settingsService = new SettingsService()

settingsRouter.get('/authorizedUsers', async (req: Request, res: Response) => {
  res.json(await settingsService.listAuthorizedUsers())
})

settingsRouter.post('/authorizedUsers', async (req: Request, res: Response) => {
  const authorizedUser = await settingsService.addAuthorizedUser(req.body.email)
  res.json(authorizedUser)
})

export default settingsRouter