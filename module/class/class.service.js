const { Op } = require('sequelize')
const uniqid = require('uniqid')

const classModel = require('./class.model')
const userClassModel = require('../user-class/user-class.model')

class ClassService {

  async getAll(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = {}

    if (body.form['name']) {
      where['name'] = { [Op.iLike]: `%${body.form['name']}%` }
    }

    if (body.form['code']) {
      where['code'] = body.form['code']
    }

    if (body.form['start']) {
      where['start'] = { [Op.gte]: body.form['start'] }
    }

    if (body.form['end']) {
      where['end'] = { [Op.lte]: body.form['end'] }
    }

    const offset = body.offset ? parseInt(body.offset) : 0
    const limit = body.length && body.length > 0 ? parseInt(body.length) : 10000000
    const order = [body.order ? body.order : ['id', 'ASC']]

    return await classModel.findAll({where, offset, limit, order})
  }

  async getOne(id) {
    return await classModel.findOne({ where: { id } })
  }

  async getOneByCode(code) {
    return await classModel.findOne({ where: { code: { [Op.iLike]: code } }, raw: true })
  }

  async create(bulk) {
    const code = uniqid.time() + Math.floor(Math.random() * 9)
    bulk['code'] = code.replace(/(\w{3})(\w{3})/, '$1-$2-').toUpperCase()

    return classModel.create(bulk)
  }

  async update(id, bulk) {
    Object.keys(bulk).map(el => {
      if (!bulk[el]) delete bulk[el]
    })

    return classModel.update(bulk, { where: { id } })
  }

  async delete(id) {
    return await classModel.destroy({ where: { id } })
  }

  async register(classId, userId) {
    return await userClassModel.create({ class_id: classId, user_id: userId })
  }

}

module.exports = new ClassService()
