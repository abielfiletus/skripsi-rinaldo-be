const Express = require('express')

const controller = require('./auth.controller')
const { create } = require('../user/user.controller')
const validator = require('./auth.validation')
const router = new Express.Router()

router.post('/login', validator.login, controller.login)
router.post('/register', validator.register, create)
router.post('/forgot-password', validator.forgotPassword, controller.forgotPassword)

module.exports = router
