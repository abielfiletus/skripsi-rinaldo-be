const Express = require('express')

const controller = require('./class-materi.controller')
const router = new Express.Router()

router.get('/', controller.getAll)
router.get('/teacher', controller.getAllTeacher)
router.get('/:id', controller.getOne)

router.post('/', controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router
