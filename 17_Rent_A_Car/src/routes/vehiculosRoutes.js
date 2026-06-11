const express = require('express');
const router = express.Router();

const vehiculosController = require('../controllers/vehiculosController');
const authenticate = require('../middlewares/authenticate');

router.get('/', authenticate, vehiculosController.obtenerVehiculos);

router.post('/', authenticate, vehiculosController.crearVehiculo);

router.get('/disponibles', authenticate, vehiculosController.buscarDisponibles);

router.get('/:id', authenticate, vehiculosController.obtenerVehiculoPorId);

router.put('/:id', authenticate, vehiculosController.actualizarVehiculo);

router.delete('/:id', authenticate, vehiculosController.eliminarVehiculo);

module.exports = router;