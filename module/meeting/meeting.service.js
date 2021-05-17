const usulanMeetingModel = require('../usulan-meeting/usulan-meeting.model')
const classModel = require('../class/class.model')
const model = require('./meeting.model')

class MeetingService {

  async getAll(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = {}

    if (body.form['class_id']) {
      where['class_id'] = body.form['class_id']
    }

    if (body.form['user_id']) {
      where['$usulan_meeting.class.createdBy$'] = body.form['user_id']
    }

    const offset = body.offset ? parseInt(body.offset) : 0
    const limit = body.length && body.length > 0 ? parseInt(body.length) : 10000000
    const order = [body.order ? body.order : ['id', 'ASC']]
    const include = {
      model: usulanMeetingModel,
      as: 'usulan_meeting',
      include: {
        model: classModel,
        as: 'class'
      }
    }

    return await model.findAll({where, offset, limit, order, include})
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
