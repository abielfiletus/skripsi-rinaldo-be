const model = require('../user-class-history/user-class-history.model')

class DashboardService {

  async getAll(body) {
    const where = []

    if (body.user_id) {
      where.push(`user_id = ${body.user_id}`)
    }

    if (body.class_id) {
      where.push(`class_id = ${body.class_id}`)
    }

    return await model.sequelize.query(`select sum(nilai) as nilai, sum(durasi) as durasi, (CASE WHEN sum(nilai) is null THEN null WHEN (select nilai_lulus from class where id = ${body.class_id}) < sum(nilai) THEN 'Lulus' ELSE 'Tidak Lulus' END) as status from user_class_history ${where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''}`)
  }

}

module.exports = new DashboardService()
