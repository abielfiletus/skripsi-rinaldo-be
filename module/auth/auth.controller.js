const jwt = require('jsonwebtoken')

const service = require('../user/user.service')
const outputParser = require('../../utils/output-parser')

require('dotenv').config()

class AuthController {

  async login(req, res, next) {
    try {
      const data = await service.getOneByEmailPass(req.body.email, req.body.password)

      if (!data.success) return outputParser.fail(res, 401, data.error, '', '')

      const payload = {
        id: data.data['id'],
        email: data.data['email']
      }

      const result = data.data
      result['token'] = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256' })

      delete result['password']
      return outputParser.success(res, 200, 'Successully Login', result)
    } catch (err) {
      next(err)
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const check = await service.getOneByEmailPass(req.body.email)

      if (!check.success) return outputParser.fail(res, 400, 'Email tidak ditemukan', '', '')
 
      const id = check.data['id']
      const bulk = { password: check.data['tanggal_lahir'].replace(/[\-]/g, '') } 

      await service.update(id, bulk)

      return outputParser.success(res, 200, 'Successfully Reset Password', '')
    } catch (err) {
      next(err)
    }
  }

}

module.exports = new AuthController()
