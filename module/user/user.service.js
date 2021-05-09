const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')

const model = require('./user.model')
const roleModel = require('../role/role.model')

class UserService {

  async getAll(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = {}

    if (body.form && body.form.hasOwnProperty('name') && body.form['name']) {
      where['name'] = { [Op.iLike]: `%${body.form['name']}%` }
    }

    if (body.form && body.form.hasOwnProperty('nis') && body.form['nis']) {
      where['nis'] = { [Op.gte]: body.form['nis'] }
    }

    if (body.form && body.form.hasOwnProperty('role_id') && body.form['role_id']) {
      where['role_id'] = body.form['role_id']
    }

    const offset = body.offset ? parseInt(body.offset) : 0
    const limit = body.length && body.length > 0 ? parseInt(body.length) : 10000000
    const order = [body.order ? body.order : ['id', 'ASC']]
    const attributes = { exclude: ['password'] }
    const include = { model: roleModel, as: 'role' }

    return await model.findAll({attributes, where, offset, limit, order, include})
  }

  async getOne(id) {
    return await model.findOne({ attributes: { exclude: ['password'] }, where: { id } })
  }

  async getOneByEmailPass(email, pass) {
    const include = { model: roleModel, as: 'role' }
    const data = await model.findOne({ where: { email }, include, raw: true })

    if (!data) return { success: false, error: 'Kredensial tidak sesuai' }

    if (pass && !bcrypt.compareSync(pass, data['password'])) return { success: false, error: 'Kredensial tidak sesuai' }

    return { success: true, data: data }
  }

  async create(bulk) {
    const salt = bcrypt.genSaltSync(10)
    bulk['password'] = bcrypt.hashSync(bulk['password'], salt)

    return model.create(bulk);
  }

  async update(id, bulk) {
    if (bulk.hasOwnProperty('password') && bulk.password) {
      const salt = bcrypt.genSaltSync(10)
      bulk.password = bcrypt.hashSync(bulk.password, salt)
    }

    return await model.update(bulk, { where: { id } })
  }

  async delete(id) {
    return await model.destroy({ where: { id } })
  }

}

module.exports = new UserService()
