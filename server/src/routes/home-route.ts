import express from 'express'
import * as homeControllers from '../controllers/home-controller'

const router = express.Router()
router.get('/', homeControllers.homeGet)

export default router