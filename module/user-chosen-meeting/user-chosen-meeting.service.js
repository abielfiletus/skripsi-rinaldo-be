const { Op } = require('sequelize')
const moment = require('moment')

const usulanMeetingModel = require('../usulan-meeting/usulan-meeting.model')
const classModel = require('../class/class.model')
const userClassModel = require('../user-class/user-class.model')
const userModel = require('../user/user.model')
const model = require('./user-chosen-meeting.model')

class UserChosenMeetingService {

  async getAll(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = []

    if (body.form['user_id']) {
      where.push(`user_id = '${body.form['user_id']}'`)
    }

    if (body.form['usulan_meeting_id']) {
      where.push(`usulan_meeting_id = '${body.form['usulan_meeting_id']}'`)
    }

    return await model.sequelize.query(`SELECT ucm.id, ucm.user_id, ucm.chosen_date, u.name, u2.name as student_name, u2.avatar FROM "user_chosen_meeting" ucm  JOIN "user" u ON ucm.user_id = u.id JOIN "user" u2 on u2.nis = u.nis AND u2.role_id = 2 ${where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''}`)
  }

  async getAllOrtu(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = {}

    if (body.form['user_id']) {
      where['user_id'] = body.form.user_id
    }

    if (body.form['nis']) {
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
      where['$usulan_meeting.class.id$'] = userClass['class.id']
    }

    if (body.form['usulan_meeting_id']) {
      where['usulan_meeting_id'] = body.form.usulan_meeting_id
    }

    const offset = body.offset ? parseInt(body.offset) : 0
    const limit = body.length && body.length > 0 ? parseInt(body.length) : 10000000
    const order = [body.order ? body.order : ['id', 'ASC']]
    const include = {
      model: usulanMeetingModel,
      as: 'usulan_meeting',
      include: {
        model: classModel,
        as: 'class',
      }
    }

    return await model.findAll({where, offset, limit, order, include})
  }

  async getOne(id, raw=false) {
    return await model.findOne({ where: { id }, raw })
  }

  async getOneByUserAndMeeting(user_id, usulan_meeting_id) {
    return await model.findOne({ where: { user_id, usulan_meeting_id }, raw: true })
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

module.exports = new UserChosenMeetingService()
