const service = require('./user-class.service')
const outputParser = require('../../utils/output-parser')

class UserClassController {

  async getAll(req, res, next) {
    try {
      const body = JSON.stringify(req.body) !== '{}' ? req.body : req.query

      const data = await service.getAll(body)

      return outputParser.success(res, 200, 'Successfully Get Data', data)
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const check = await service
    } catch (err) {
      next(err)
    }
  }

}

module.exports = new UserClassController()
