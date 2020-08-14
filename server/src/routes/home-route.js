const express = require('express')
const homeControllers = require('../controllers/home-controller.js')

const router = express.Router()
router.get('/', homeControllers.homeGet)

module.exports = router