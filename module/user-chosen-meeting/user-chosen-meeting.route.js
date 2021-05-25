const Express = require('express')

const controller = require('./user-chosen-meeting.controller')
const router = new Express.Router()

router.get('/', controller.getAll)
router.get('/orang-tua', controller.getAllOrtu)
router.get('/:id', controller.getOne)

router.post('/', controller.create)
router.post('/register-usulan', controller.registerUsulan)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router
