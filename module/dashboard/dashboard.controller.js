const service = require('./dashboard.service')
const outputParser = require('../../utils/output-parser')

class DashboardController {

  async getSummary(req, res, next) {
    try {
      const body = JSON.stringify(req.body) !== '{}' ? req.body : req.query

      const data = await service.getAll(body)

      return outputParser.success(res, 200, 'Successfully Get Data', data[0])
    } catch (err) {
      next(err)
    }
  }

}

module.exports = new DashboardController()
