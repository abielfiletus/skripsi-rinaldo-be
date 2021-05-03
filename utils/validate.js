const { validationResult } = require('express-validator')

const _errorFormatter = ({ msg }) => {
  return msg
}

module.exports = async (validations, req, res, next) => {
  await Promise.all(validations.map(validation => validation.run(req)));

  const errors = validationResult(req).formatWith(_errorFormatter);
  if (errors.isEmpty()) {
    return next();
  }

  res.status(400).json({
    message: 'Validation Error',
    error: errors.mapped()
  })
}
