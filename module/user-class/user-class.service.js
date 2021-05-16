const { Op } = require('sequelize')

const model = require('./user-class.model')
const classModel = require('../class/class.model')
const userModel = require('../user/user.model')

class UserClassService {

  async getAll(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = {}

    if (body.form['user_id']) {
      where['user_id'] = body.form['user_id']
    }

    if (body.form['start']) {
      where['$class.start$'] = { [Op.lte]: body.form['start'] }
    }

    if (body.form['end']) {
      where['$class.end$'] = { [Op.gte]: body.form['end'] }
    }

    const offset = body.offset ? parseInt(body.offset) : 0
    const limit = body.length && body.length > 0 ? parseInt(body.length) : 10000000
    const order = [body.order ? body.order : ['id', 'ASC']]
    const include = { model: classModel, as: 'class' }

    if (body.form['include_user']) {
      include.push({ model: userModel, as: 'user' })
    }

    return await model.findAll({where, offset, limit, order, include})
  }

}

module.exports = new UserClassService()
