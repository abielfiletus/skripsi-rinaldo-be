const service = require('./class.service')
const outputParser = require('../../utils/output-parser')

class ClassController {

  async getAll(req, res, next) {
    try {
      const body = JSON.stringify(req.body) !== '{}' ? req.body : req.query

      const data = await service.getAll(body)

      return outputParser.success(res, 200, 'Successfully Get Data', data)
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
      const bulk = { name: req.body.name }

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

      const data = await service.register(check.id, req.body.user_id)

      return outputParser.success(res, 200, 'Successfully Registered', data)
    } catch (err) {
      next(err)
    }
  }

}

module.exports = new ClassController()
