const model = require('./meeting.model')

class MeetingService {

  async getAll(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = {}

    if (body.form['class_id']) {
      where['class_id'] = body.form['class_id']
    }

    const offset = body.offset ? parseInt(body.offset) : 0
    const limit = body.length && body.length > 0 ? parseInt(body.length) : 10000000
    const order = [body.order ? body.order : ['id', 'ASC']]

    return await model.findAll({where, offset, limit, order})
  }

  async getOne(id, raw=false) {
    return await model.findOne({ where: { id }, raw })
  }

  async create(bulk) {
    return model.create(bulk)
  }

  async update(id, bulk) {
    Object.keys(bulk).map(el => {
      if (!bulk[el]) delete bulk[el]
    })

    return model.update(bulk, { where: { id } })
  }

  async delete(id) {
    return model.destroy({ where: { id } })
  }

}

module.exports = new MeetingService()
