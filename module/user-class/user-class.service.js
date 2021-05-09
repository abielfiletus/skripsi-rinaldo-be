const { Op } = require('sequelize')

const model = require('./user-class.model')
const classModel = require('../user/user.model')

class UserClassService {

  async getAll(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = {}

    if (body.form['start']) {
      where['$class.start$'] = { [Op.gte]: body.form['start'] }
    }

    if (body.form['end']) {
      where['$class.end$'] = { [Op.lte]: body.form['end'] }
    }

    const offset = body.offset ? parseInt(body.offset) : 0
    const limit = body.length && body.length > 0 ? parseInt(body.length) : 10000000
    const order = [body.order ? body.order : ['id', 'ASC']]
    const include = { model: classModel, as: 'class' }

    return await model.findAll({where, offset, limit, order, include})
  }

}

module.exports = new UserClassService()
