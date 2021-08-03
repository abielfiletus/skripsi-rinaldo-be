const {Op} = require("sequelize");
const moment = require("moment");

const usulanMeetingModel = require('../usulan-meeting/usulan-meeting.model')
const classModel = require('../class/class.model')
const model = require('./meeting.model')
const userModel = require("../user/user.model");
const userClassModel = require("../user-class/user-class.model");

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

  async getAllOrtu(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = {}

    const user = await userModel.findOne({ where: { nis: body.form.nis }, raw: true })

    const userClass = await userClassModel.findOne({
      where: { user_id: user.id },
      include: {
        model: classModel,
        as: 'class',
        where: { end: { [Op.gte]: moment(moment.now()).endOf('days') } }
      },
      raw: true,
    })

    const offset = body.offset ? parseInt(body.offset) : 0
    const limit = body.length && body.length > 0 ? parseInt(body.length) : 10000000
    const order = [body.order ? body.order : ['id', 'ASC']]
    const include = {
      model: usulanMeetingModel,
      as: 'usulan_meeting',
      where: { class_id: userClass['class.id'] },
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
