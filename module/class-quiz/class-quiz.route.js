const Express = require('express')

const controller = require('./class-quiz.controller')
const router = new Express.Router()

router.get('/', controller.getAll)
router.get('/:id', controller.getOne)
router.get('/random-quiz/:id', controller.getRandQuiz)

router.post('/', controller.create)
router.post('/submit-quiz', controller.submitQuiz)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router
