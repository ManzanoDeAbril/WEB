const express = require('express');
const router = express.Router();

const reservasController = require('../controllers/reservasController');
const authenticate = require('../middlewares/authenticate');
const extrasCtrl = require('../controllers/extrasController');
const multasCtrl = require('../controllers/multasController');

router.get('/', authenticate, reservasController.obtenerReservas);

router.post('/', authenticate, reservasController.crearReserva);


router.get('/:id', authenticate, reservasController.obtenerReservaPorId);

router.put('/:id', authenticate, reservasController.actualizarReserva);

router.delete('/:id', authenticate, reservasController.eliminarReserva);

router.get('/:id/extras',             authenticate, extrasCtrl.listarExtrasDeReserva);

router.post('/:id/extras',            authenticate, extrasCtrl.agregarExtraAReserva);

router.delete('/:id/extras/:extraId', authenticate, extrasCtrl.quitarExtraDeReserva);

router.get('/:id/resumen',            authenticate, multasCtrl.resumenReserva);


module.exports = router;