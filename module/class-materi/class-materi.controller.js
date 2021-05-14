const path = require('path')
const fileSanitize = require('sanitize-filename')
const fs = require('fs-extra')

const service = require('./class-materi.service')
const outputParser = require('../../utils/output-parser')

class ClassMateriController {

  async getAll(req, res, next) {
    try {
      const body = JSON.stringify(req.body) !== '{}' ? req.body : req.query

      const data = await service.getAll(body)

      return outputParser.success(res, 200, 'Successfully Get Data', data[0])
    } catch (err) {
      next(err)
    }
  }

  async getAllTeacher(req, res, next) {
    try {
      const body = JSON.stringify(req.body) !== '{}' ? req.body : req.query

      const data = await service.getAllTeacher(body)

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
    const file = req.files['materi']
    const ext = (path.extname(file.name)).toLowerCase()

    if (ext !== '.pdf') return outputParser.fail(res, 400, 'Validation Error', { materi: 'extention not allowed' }, '')

    const clearName = fileSanitize(file.name)

    try {
      await file.mv('./assets/materi/' + clearName)

      const bulk = {
        name: req.body.name ? req.body.name : null,
        path: process.env.SITE_URL + '/assets/materi/' + clearName,
        class_id: req.body.class_id ? req.body.class_id : null,
      }

      const data = await service.create(bulk)

      return outputParser.success(res, 201, 'Succesfully Create Data', data)
    } catch (err) {
      if (fs.existsSync('./assets/materi/' + clearName)) {
        fs.removeSync('./assets/materi/' + clearName)
      }

      next(err)
    }
  }

  async update(req, res, next) {
    let file;
    let clearName;

    if (req.files && req.files.hasOwnProperty('materi') && req.files['materi']) {
      file = req.files['materi']
      const ext = (path.extname(file.name)).toLowerCase()

      if (ext !== '.pdf') return outputParser.fail(res, 400, 'Validation Error', { materi: 'extention not allowed' }, '')

      clearName = fileSanitize(file.name)
    }

    try {
      const check = await service.getOne(req.params.id)

      if (!check) return outputParser.fail(res, 400, 'Validation Error', { id: 'Tidak ditemukan' }, '')

      if (file) await file.mv('./assets/materi/' + clearName)

      const bulk = {
        name: req.body.name ? req.body.name : null,
        path: file ? process.env.SITE_URL + '/assets/materi/' + clearName : null,
        class_id: req.body.class_id ? req.body.class_id : null,
      }

      const data = await service.update(req.params.id, bulk)

      return outputParser.success(res, 200, 'Successfully Edit Data', data)
    } catch (err) {
      if (clearName && fs.existsSync('./assets/materi/' + clearName)) {
        fs.removeSync('./assets/materi/' + clearName)
      }

      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const check = await service.getOne(req.params.id)

      if (!check) return outputParser.fail(res, 400, 'Validation Error', { id: 'Tidak ditemukan' }, '')

      const data = await service.delete(req.params.id)
      const path = check['path'].replaceAll(new RegExp(process.env.SITE_URL, 'g'), '');
      if (fs.existsSync(`./${path}`)) {
        fs.removeSync(`./${path}`)
      }

      return outputParser.success(res, 200, 'Successfully Delete Data', data)
    } catch (err) {
      next(err)
    }
  }

}

module.exports = new ClassMateriController()
