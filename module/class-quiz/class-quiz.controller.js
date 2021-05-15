const service = require('./class-quiz.service')
const userClassHistoryService = require('../user-class-history/user-class-history.service')
const outputParser = require('../../utils/output-parser')

class ClassQuizController {

  async getAll(req, res, next) {
    try {
      const body = JSON.stringify(req.body) !== '{}' ? req.body : req.query

      const data = await service.getAll(body)

      return outputParser.success(res, 200, 'Successfully Get Data', data[0])
    } catch (err) {
      next(err)
    }
  }

  async getOne(req, res, next) {
    try {
      const data = await service.getOne(req.params.id)

      return outputParser.success(res, 200, 'Successfully Get Data', data)
    } catch (err) {
      next(err)
    }
  }

  async getOneDetailSoal(req, res, next) {
    try {
      const data = await service.getOneDetailSoal(req.params.id)

      return outputParser.success(res, 200, 'Successfully Get Data', data)
    } catch (err) {
      next(err)
    }
  }

  async create(req, res, next) {
    try {
      const bulk = {
        name: req.body.name ? req.body.name : null,
        total_soal: 0,
        nilai_lulus: req.body.nilai_lulus ? req.body.nilai_lulus : null,
        class_materi_id: req.body.class_materi_id ? req.body.class_materi_id : null,
        tanggal_kumpul: req.body.tanggal_kumpul ? req.body.tanggal_kumpul : null,
      }

      const data = await service.create(bulk)

      return outputParser.success(res, 201, 'Successfully Create Data', data)
    } catch (err) {
      next(err)
    }
  }

  async createDetailSoal(req, res, next) {
    try {
      const check = await service.getOne(req.body.class_quiz_id, true)

      if (!check) return outputParser.fail(res, 400, 'Validation Error', { id: 'Tidak ditemukan' }, '')

      const bulk = {
        class_quiz_id: req.body.class_quiz_id ? req.body.class_quiz_id : null,
        soal: req.body.soal ? req.body.soal : null,
        jawaban_a: req.body.jawaban_a ? req.body.jawaban_a : null,
        jawaban_b: req.body.jawaban_b ? req.body.jawaban_b : null,
        jawaban_c: req.body.jawaban_c ? req.body.jawaban_c : null,
        jawaban_d: req.body.jawaban_d ? req.body.jawaban_d : null,
        jawaban_e: req.body.jawaban_e ? req.body.jawaban_e : null,
        jawaban_benar: req.body.jawaban_benar ? req.body.jawaban_benar : null,
      }

      const data = await service.createDetailSoal(bulk)
      await service.update(req.body.class_quiz_id, { total_soal: check['total_soal'] + 1 })

      return outputParser.success(res, 201, 'Successfully Create Data', data)
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const bulk = {
        name: req.body.name ? req.body.name : null,
        total_soal: req.body.total_soal ? req.body.total_soal : null,
        nilai_lulus: req.body.nilai_lulus ? req.body.nilai_lulus : null,
        class_materi_id: req.body.class_materi_id ? req.body.class_materi_id : null,
        soal: req.body.soal ? req.body.soal : null,
      }

      const check = await service.getOne(req.params.id)

      if (!check) return outputParser.fail(res, 400, 'Validation Error', { id: 'Tidak ditemukan' }, '')

      const data = await service.update(req.params.id, bulk)

      return outputParser.success(res, 200, 'Successfully Update Data', data)
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const check = await service.getOne(req.params.id)

      if (!check) return outputParser.fail(res, 400, 'Validation Error', { id: 'Tidak ditemukan' }, '')

      const data = await service.delete(req.params.id)

      return outputParser.success(res, 200, 'Successfully Delete Data', data)
    } catch (err) {
      next(err)
    }
  }


  async deleteSoal(req, res, next) {
    try {
      const check = await service.getOneDetailSoal(req.params.id)

      if (!check) return outputParser.fail(res, 400, 'Validation Error', { id: 'Tidak ditemukan' }, '')

      const data = await service.deleteSoal(req.params.id)

      return outputParser.success(res, 200, 'Successfully Delete Data', data)
    } catch (err) {
      next(err)
    }
  }

  async getRandQuiz(req, res, next) {
    try {
      const data = await service.getRandSoal(req.params.id)

      return outputParser.success(res, 200, 'Successfully Get Data', data)
    } catch (err) {
      next(err)
    }
  }

  async submitQuiz(req, res, next) {
    try {
      const id = []
      const jawaban = []
      const correct = []
      const wrong = []

      req.body.jawaban.map(el => {
        id.push(el.id)
        jawaban[el.id] = el.jawaban
      })

      const soal = await service.getSoalArray(id)

      soal.map(el => {
        if (el.jawaban_benar === jawaban[el.id]) {
          correct.push(el.id)
        } else {
          wrong.push(el.id)
        }
      })

      const nilai = correct.length / id.length * 100

      const classQuiz = await service.getOne(req.body.class_quiz_id, true)
      const check = await userClassHistoryService.getOneByUserAndMateriId(req.body.user_id, req.body.class_materi_id)

      const durasi = req.body.durasi ? req.body.durasi : null

      let data
      const bulk = {
        class_id: req.body.class_id ? req.body.class_id : null,
        user_id: req.body.user_id ? req.body.user_id : null,
        class_materi_id: req.body.class_materi_id ? req.body.class_materi_id : null,
        class_quiz_id: req.body.class_quiz_id ? req.body.class_quiz_id : null,
        durasi: durasi && check ? parseInt(durasi) + parseInt(check['durasi']) : parseInt(durasi),
        nilai: nilai,
        status: nilai >= classQuiz['nilai_lulus'] ? 'Lulus' : 'Tidak Lulus',
      }

      if (check) {
        data = await userClassHistoryService.update(check['id'], bulk)
      } else {
        data = await userClassHistoryService.create(bulk)
      }

      return outputParser.success(res, 200, 'Successfully Submit Quiz', data)
    } catch (err) {
      next(err)
    }
  }

}

module.exports = new ClassQuizController()
