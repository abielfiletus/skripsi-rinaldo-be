const Express = require('express')

const controller = require('./dashboard.controller')
const router = new Express.Router()

router.get('/summary', controller.getSummary)

module.exports = router
