const { Op, QueryTypes } = require('sequelize')

const classQuizModel = require('./class-quiz.model')
const quizDetailModel = require('./quiz-detail.model')

const randArray = (arr) => {
  arr.map((el, i) => {
    const swapIndex = Math.floor(Math.random() * arr.length)
    const currentCard = arr[i]
    arr[i] = arr[swapIndex]
    arr[swapIndex] = currentCard
  })

  return arr
}

class ClassQuizService {

  async getAll(body) {
    body.form = typeof body.form === 'string' ? JSON.parse(body.form) : body.form
    const where = {}

    if (body.form['name']) {
      where['name'] = { [Op.iLike]: body.form['name'] }
    }

    if (body.form['class_materi_id']) {
      where['class_materi_id'] = body.form['class_materi_id']
    }

    const offset = body.offset ? parseInt(body.offset) : 0
    const limit = body.length && body.length > 0 ? parseInt(body.length) : 10000000
    const order = [body.order ? body.order : ['id', 'ASC']]

    return await classQuizModel.findAll({where, offset, limit, order})
  }

  async getOne(id, raw=false) {
    return await classQuizModel.findOne({ where: { id }, raw })
  }

  async create(bulk) {
    const trx = await classQuizModel.sequelize.transaction()

    try {
      const data = await classQuizModel.create(bulk)

      if (bulk.soal) {
        bulk.soal.map(el => {
          el.class_quiz_id = data.getDataValue('id')
        })

        await quizDetailModel.bulkCreate(bulk.soal)

        delete bulk.soal
      }

      await trx.commit()

      return data
    } catch (err) {
      console.log(err)
      await trx.rollback()
    }
  }

  async update(id, bulk) {
    const trx = await classQuizModel.sequelize.transaction()

    try {
      if (bulk.soal) {
        await quizDetailModel.destroy({ where: { class_materi_id: id } })
        await quizDetailModel.bulkCreate(bulk.soal)

        delete bulk.soal
      }

      Object.keys(bulk).map(el => {
        if (!bulk[el]) delete bulk[el]
      })

      const data = classQuizModel.update(bulk, { where: { id } })
      await trx.commit()

      return data
    } catch (err) {
      await trx.rollback()
      return false
    }
  }

  async delete(id) {
    const trx = await classQuizModel.sequelize.transaction()

    try {
      await quizDetailModel.destroy({ where: { class_materi_id: id } })
      const data = classQuizModel.destroy({ where: { id } })

      await trx.commit()
      return data
    } catch (err) {
      await trx.rollback()
      return false
    }
  }

  async getSoalArray(id) {
    return await quizDetailModel.findAll({ where: { id: { [Op.in]: id } }, raw: true })
  }

  async getRandSoal(id) {
    let rowData = await quizDetailModel.sequelize.query(
      `SELECT cq.id, cq.name, cq.total_soal, cq.nilai_lulus, cq.class_materi_id, qd.soal, qd.jawaban_a, qd.jawaban_b, qd.jawaban_c, qd.jawaban_d, qd.jawaban_e FROM class_quiz AS cq JOIN quiz_detail AS qd ON cq.id = qd.class_quiz_id WHERE cq.class_materi_id = ?`,
      {
        replacements: [id],
        type: QueryTypes.SELECT
      }
    )

    rowData = randArray(rowData)
    let data = {}

    rowData.map((el, i) => {
      if (i == 0) {
        data = {
          id: el.id,
          name: el.name,
          total_soal: el.total_soal,
          nilai_lulus: el.nilai_lulus,
          class_materi_id: el.class_materi_id,
          soal: [
            {
              soal: el.soal,
              jawaban_a: el.jawaban_a,
              jawaban_b: el.jawaban_b,
              jawaban_c: el.jawaban_c,
              jawaban_d: el.jawaban_d,
              jawaban_e: el.jawaban_e,
            }
          ]
        }
      } else {
        data.soal.push({
          soal: el.soal,
          jawaban_a: el.jawaban_a,
          jawaban_b: el.jawaban_b,
          jawaban_c: el.jawaban_c,
          jawaban_d: el.jawaban_d,
          jawaban_e: el.jawaban_e,
        })
      }
    })

    return data
  }

}

module.exports = new ClassQuizService()
