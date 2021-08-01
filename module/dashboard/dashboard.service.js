const { Op } = require('sequelize')
const moment = require('moment')
const model = require('../user-class-history/user-class-history.model')
const classModel = require('../class/class.model')
const userModel = require('../user/user.model')
const userClassModel = require('../user-class/user-class.model')
const meetingModel = require('../meeting/meeting.model')
const materiModel = require('../class-materi/class-materi.model')
const usulanMeetingModel = require('../usulan-meeting/usulan-meeting.model')

class DashboardService {

  async getAll(body) {
    const where = []

    if (body.user_id) {
      where.push(`uc.user_id = ${body.user_id}`)
    }

    if (body.class_id) {
      where.push(`uc.class_id = ${body.class_id}`)
    }

    return await model.sequelize.query(`SELECT uc.id, sum(uch.nilai) as nilai, sum(uch.durasi) as durasi, (CASE WHEN sum(uch.nilai) is null THEN null WHEN (select nilai_lulus from class where id = ${body.class_id}) < sum(uch.nilai) THEN 'Lulus' ELSE 'Tidak Lulus' END) as status from user_class uc LEFT JOIN user_class_history uch on uch.user_id = uc.id ${where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''} group by 1`)
  }

  async summaryOrangTua(body) {
    const murid = await userModel.findOne({ where: { nis: body.nis, role_id: 2 }, raw: true })
    const classMurid = await userClassModel.findOne({
      where: { user_id: murid.id },
      include: {
        model: classModel,
        as: 'class',
      },
      order: [[classModel, 'end', 'desc']],
      limit: 1,
      raw: true,
    })

    const summaryMurid = await model.sequelize.query(`SELECT uc.id, sum(uch.nilai) as nilai, sum(uch.durasi) as durasi, (CASE WHEN sum(uch.nilai) is null THEN null WHEN (select nilai_lulus from class where id = '${classMurid.class_id}') < sum(uch.nilai) THEN 'Lulus' ELSE 'Tidak Lulus' END) as status from user_class uc LEFT JOIN user_class_history uch on uch.user_id = uc.id WHERE uc.user_id = '${murid.id}' and uc.class_id = '${classMurid.class_id}' group by 1`);

    const now = moment(moment.now()).startOf('days').format('YYYY-MM-DD HH:mm:ss')
    const nextWeek = moment(moment.now()).add(2, "weeks").startOf('days').format('YYYY-MM-DD HH:mm:ss')
    const meeting = await meetingModel.findAll({
      where: { start_date: { [Op.between]: [now, nextWeek] } },
      include: {
        model: usulanMeetingModel,
        as: 'usulan_meeting',
        where: {
          class_id: classMurid.class_id
        }
      }
    })

    return { murid: summaryMurid[0], meeting: meeting }
  }

  async summaryGuru(body) {
    const classlist = await classModel.findAll({
      where: { createdBy: body.user_id, end: {[Op.gte]: moment(body.date, 'YYYY-MM-DD')} },
      raw: true
    })

    const list = []
    classlist.map(item => { list.push(item.id) })

    const rawMateri = await materiModel.findAll({
      where: { class_id: { [Op.in]: list } },
      raw: true,
      include: {
        model: classModel,
        as: 'class'
      },
    })
    const materi = []
    const ids = [];

    rawMateri.map(item => {
      const id = ids.indexOf(item.class_id);
      if (id < 0) {
        materi[ids.length] = {
          class: {
            id: item['class.id'],
            name: item['class.name'],
            code: item['class.code'],
            start: item['class.start'],
            end: item['class.end'],
            nilai_lulus: item['class.nilai_lulus'],
          },
          materi: [
            {
              id: item.id,
              name: item.name,
              path: item.path,
              class_id: item.class_id,
            }
          ]
        }
        ids.push(item.class_id);
      } else {
        materi[id]['materi'].push({
          id: item.id,
          name: item.name,
          path: item.path,
          class_id: item.class_id,
        })
      }
    })

    const now = moment(moment.now()).startOf('days').format('YYYY-MM-DD HH:mm:ss')
    const nextWeek = moment(moment.now()).add(2, "weeks").startOf('days').format('YYYY-MM-DD HH:mm:ss')
    const meeting = await meetingModel.findAll({
      where: { start_date: { [Op.between]: [now, nextWeek] } },
      include: {
        model: usulanMeetingModel,
        as: 'usulan_meeting',
        where: { class_id: { [Op.in]: list } },
        include: {
          model: classModel,
          as: 'class'
        }
      }
    })

    return {materi: materi, meeting: meeting}
  }

}

module.exports = new DashboardService()
