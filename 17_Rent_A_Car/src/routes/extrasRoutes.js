// src/routes/extrasRoutes.js — rq-10
const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/extrasController');
const authenticate = require('../middlewares/authenticate');

// Catálogo de extras
router.get('/',    authenticate, ctrl.listarExtras);
router.post('/',   authenticate, ctrl.crearExtra);
router.put('/:id', authenticate, ctrl.actualizarExtra);
router.delete('/:id', authenticate, ctrl.eliminarExtra);

module.exports = router;
