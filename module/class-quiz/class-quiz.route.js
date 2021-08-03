const Express = require('express')

const controller = require('./class-quiz.controller')
const router = new Express.Router()

router.get('/', controller.getAll)
router.get('/:id', controller.getOne)
router.get('/detail-quiz/:id', controller.getOneDetailSoal)
router.get('/random-quiz/:id', controller.getRandQuiz)

router.post('/', controller.create)
router.post('/detail-quiz', controller.createDetailSoal)
router.post('/submit-quiz', controller.submitQuiz)
router.put('/:id', controller.update)
router.put('/detail-quiz/:id', controller.getOneDetailSoal)
router.delete('/:id', controller.delete)
router.delete('/quiz-detail/:id', controller.deleteSoal)

module.exports = router
