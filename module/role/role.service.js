const { Op } = require('sequelize')

const model = require('./role.model')

class RoleService {

  async getAll(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = {}

    if (body.form['name']) {
      where['name'] = { [Op.iLike]: `%${body.form['name']}%` }
    }

    const offset = body.offset ? parseInt(body.offset) : 0
    const limit = body.length && body.length > 0 ? parseInt(body.length) : 10000000
    const order = [body.order ? body.order : ['id', 'ASC']]

    return await model.findAll({where, offset, limit, order})
  }

  async getOne(id) {
    return await model.findOne({ where: { id } })
  }

  async create(bulk) {
    return model.create(bulk)
  }

  async update(id, bulk) {
    return await model.update(bulk, { where: { id } })
  }

  async delete(id) {
    return await model.destroy({ where: { id } })
  }

}

module.exports = new RoleService()
