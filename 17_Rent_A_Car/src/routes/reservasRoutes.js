const express = require('express');
const router = express.Router();

const reservasController = require('../controllers/reservasController');
const authenticate = require('../middlewares/authenticate');

router.get('/', authenticate, reservasController.obtenerReservas);

router.post('/', authenticate, reservasController.crearReserva);

router.get('/:id', authenticate, reservasController.obtenerReservaPorId);

router.put('/:id', authenticate, reservasController.actualizarReserva);

router.delete('/:id', authenticate, reservasController.eliminarReserva);

module.exports = router;