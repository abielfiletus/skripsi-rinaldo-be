const Express = require('express')

const controller = require('./class.controller')
const router = new Express.Router()

router.get('/', controller.getAll)
router.get('/:id', controller.getOne)

router.post('/', controller.create)
router.post('/register-class', controller.register)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router
