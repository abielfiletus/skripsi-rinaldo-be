const jwt = require('jsonwebtoken')

const service = require('./class.service')
const outputParser = require('../../utils/output-parser')

class ClassController {

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

  async create(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')
      const user = jwt.decode(token[1])

      const bulk = {
        name: req.body.name ? req.body.name : null,
        start: req.body.start ? req.body.start : null,
        end: req.body.end ? req.body.end : null,
        nilai_lulus: req.body.nilai_lulus ? req.body.nilai_lulus : null,
        createdBy: user.id,
      }

      const data = await service.create(bulk)

      return outputParser.success(res, 201, 'Successfully Insert Data', data)
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const bulk = {
        name: req.body.name ? req.body.name : null,
        code: req.body.code ? req.body.code : null,
        start: req.body.start ? req.body.start : null,
        end: req.body.end ? req.body.end : null,
        nilai_lulus: req.body.nilai_lulus ? req.body.nilai_lulus : null,
      }

      const data = await service.update(req.params.id, bulk)

      return outputParser.success(res, 200, 'Successfully Update Data', data)
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const data = await service.delete(req.params.id)

      return outputParser.success(res, 200, 'Successfully Delete Data', data)
    } catch (err) {
      next(err)
    }
  }

  async register(req, res, next) {
    try {
      const check = await service.getOneByCode(req.body.code)

      if (!check) return outputParser.fail(res, 400, 'Validation Error', { code: 'Tidak ditemukan'}, '' )

      await service.register(check.id, req.body.user_id)

      return outputParser.success(res, 200, 'Successfully Registered', check)
    } catch (err) {
      next(err)
    }
  }

}

module.exports = new ClassController()
