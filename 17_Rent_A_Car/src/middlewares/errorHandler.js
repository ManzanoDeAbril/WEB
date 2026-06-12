const { ValidationError, UniqueConstraintError } = require('sequelize');

module.exports = (err, req, res, next) => {

  console.error(err);

  // Sequelize Validation
  if (err instanceof ValidationError) {
    return res.status(422).json({
      error: true,
      message: err.errors.map(e => e.message).join(', '),
      code: 'VALIDATION_ERROR'
    });
  }

  // Unique
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      error: true,
      message: 'Registro duplicado',
      code: 'DUPLICATE_ENTRY'
    });
  }

  res.status(err.status || 500).json({
    error: true,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Error interno del servidor'
        : err.message,
    code: err.code || 'INTERNAL_ERROR'
  });

};