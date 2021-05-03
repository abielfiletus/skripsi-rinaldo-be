const { check } = require('express-validator')

const validate = require('../../utils/validate')

module.exports = {

  login: (req, res, next) => {
    return validate([
      check('email')
        .notEmpty()
        .withMessage('harus terisi')
        .bail()
        .isEmail()
        .withMessage('harus berupa valid email')
        .bail()
        .normalizeEmail({gmail_remove_dots: false}),
      check('password')
        .notEmpty()
        .withMessage('harus terisi')
    ], req, res, next)
  },

  register: (req, res, next) => {
    return validate([
      check('name')
        .notEmpty()
        .withMessage('harus terisi')
        .bail()
        .isLength({max: 50})
        .withMessage('maksimal 50 karakter')
        .bail()
        .escape()
        .trim(),
      check('jenis_kelamin')
        .notEmpty()
        .withMessage('harus terisi')
        .bail()
        .escape()
        .trim(),
      check('nis')
        .notEmpty()
        .withMessage('harus terisi')
        .bail()
        .isLength({max: 20})
        .withMessage('maksimal 20 karakter')
        .bail()
        .escape()
        .trim(),
      check('tanggal_lahir')
        .notEmpty()
        .withMessage('harus terisi')
        .bail()
        .isDate({format: 'YYYY-MM-DD'})
        .withMessage('format harus YYYY-MM-DD')
        .bail()
        .toDate(),
      check('role_id')
        .notEmpty()
        .withMessage('harus terisi')
        .bail()
        .isInt()
        .withMessage('harus berupa angka')
        .bail()
        .toInt(),
      check('email')
        .notEmpty()
        .withMessage('harus terisi')
        .bail()
        .isEmail()
        .withMessage('harus berupa valid email')
        .bail()
        .isLength({max: 50})
        .withMessage('maksimal 50 karakter')
        .bail()
        .normalizeEmail({gmail_remove_dots: false}),
      check('password')
        .notEmpty()
        .withMessage('harus terisi')
        .bail()
        .isLength({min: 6, max: 12})
        .withMessage('minimal 6 karakter dan maksimal 12 karakter')
        .bail()
        .matches('[a-z]')
        .withMessage('harus memiliki 1 huruf kecil')
        .bail()
        .matches('[A-Z]')
        .withMessage('harus memiliki 1 huruf besar')
        .bail()
        .matches('[0-9]')
        .withMessage('harus memiliki 1 angka'),
      check('confirmation_password')
        .notEmpty()
        .withMessage('harus terisi')
        .bail()
        .custom(async (confirmPassword, {req}) => {
          const password = req.body.password

          if(password !== confirmPassword){
            throw new Error('password tidak sama')
          }
        })
        .trim(),
    ], req, res, next)
  },

  forgotPassword: (req, res, next) => {
    return validate([
      check('email')
        .notEmpty()
        .withMessage('harus terisi')
        .bail()
        .isEmail()
        .withMessage('harus berupa valid email')
        .bail()
        .normalizeEmail({gmail_remove_dots: false})
    ], req, res, next)
  }

}
