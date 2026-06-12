const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/passwordResetController');

router.post('/solicitar-reset', passwordResetController.solicitarReset);
router.post('/restablecer-password', passwordResetController.restablecerPassword);

module.exports = router;