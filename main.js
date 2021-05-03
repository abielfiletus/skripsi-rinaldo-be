const Express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const fileUpload = require('express-fileupload')

const jwt = require('./core/jwt')
const outputParser = require('./utils/output-parser')
const userRouter = require('./module/user/user.route')
const authRouter = require('./module/auth/auth.route')
const roleRouter = require('./module/role/role.route')
const classMateriRouter = require('./module/class-materi/class-materi.route')
const classRouter = require('./module/class/class.route')
const classQuizRouter = require('./module/class-quiz/class-quiz.route')
const userClassHistoryRouter = require('./module/user-class-history/user-class-history.route')
const meetingRouter = require('./module/meeting/meeting.route')
const userChosenMeetingRouter = require('./module/user-chosen-meeting/user-chosen-meeting.route')
const userMeetingHistoryRouter = require('./module/user-meeting-history/user-meeting-history.route')
const usulanMeetingRouter = require('./module/usulan-meeting/usulan-meeting.route')
const server = new Express()

require('dotenv').config()
require('./core/db-association')

server.use(helmet())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(fileUpload({ createParentPath: true }))

server.use('/api/auth', authRouter)
server.use('/assets/:folder/:filename', (req, res, next) => {
  try {
    return outputParser.file(res, 200, `${__dirname}/assets/${req.params['folder']}/${req.params.filename}`)
  } catch (err) {
    next(err)
  }
})

server.use(jwt)
server.use('/api/user', userRouter)
server.use('/api/role', roleRouter)
server.use('/api/class', classRouter)
server.use('/api/class-quiz', classQuizRouter)
server.use('/api/class-materi', classMateriRouter)
server.use('/api/user-class-history', userClassHistoryRouter)
server.use('/api/meeting', meetingRouter)
server.use('/api/user-chosen-meeting', userChosenMeetingRouter)
server.use('/api/user-meeting-history', userMeetingHistoryRouter)
server.use('/api/usulan-meeting', usulanMeetingRouter)

server.use((req, res) => {
  return outputParser.fail(res, 404, 'Request path not found', '')
})

server.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return outputParser.fail(res, 401, 'Unauthorized Request', err.message, err)
  }
  console.log(err)
  return outputParser.fail(res, (err.status || 500), 'Internal Server Error', err.message, err)
})

server.listen(process.env.SERVER_PORT || 3000, () => {
  console.log(`Server running on ${process.env.SERVER_PORT || 3000}`)
})

module.exports = server
