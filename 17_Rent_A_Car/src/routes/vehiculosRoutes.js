const express = require('express');
const router = express.Router();

const vehiculosController = require('../controllers/vehiculosController');

router.get('/', vehiculosController.obtenerVehiculos);

module.exports = router;

router.post('/', vehiculosController.crearVehiculo);

router.get('/:id', vehiculosController.obtenerVehiculoPorId);

router.put('/:id', vehiculosController.actualizarVehiculo);

router.delete('/:id', vehiculosController.eliminarVehiculo);