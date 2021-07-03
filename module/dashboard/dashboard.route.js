const Express = require('express')

const controller = require('./dashboard.controller')
const router = new Express.Router()

router.get('/summary', controller.getSummary)
router.get('/summary-orang-tua', controller.summaryOrangTua)
router.get('/summary-guru', controller.summaryGuru)

module.exports = router
