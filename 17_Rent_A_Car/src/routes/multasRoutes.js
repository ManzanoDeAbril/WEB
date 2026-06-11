// src/routes/multasRoutes.js — rq-10
const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/multasController');
const authenticate = require('../middlewares/authenticate');

router.get('/',    authenticate, ctrl.listarMultas);
router.get('/:id', authenticate, ctrl.obtenerMulta);
router.post('/',   authenticate, ctrl.crearMulta);
router.put('/:id', authenticate, ctrl.actualizarMulta);
router.delete('/:id', authenticate, ctrl.eliminarMulta);

module.exports = router;
