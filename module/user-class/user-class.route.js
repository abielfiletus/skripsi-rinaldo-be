const Express = require('express')

const controller = require('./user-class.controller')
const router = new Express.Router()

router.get('/', controller.getAll)

module.exports = router
