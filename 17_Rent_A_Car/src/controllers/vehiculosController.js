const { Vehiculo } = require('../../models');

exports.obtenerVehiculos = async (req, res) => {

    try {

        const vehiculos = await Vehiculo.findAll();

        res.json(vehiculos);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

exports.crearVehiculo = async (req, res) => {

    const {
        marca,
        modelo,
        anio,
        patente,
        color,
        kilometraje,
        disponible
    } = req.body;

    if (!marca || !modelo || !anio || !patente) {
        return res.status(400).json({
            error: 'Faltan campos obligatorios'
        });
    }

    try {

        const vehiculo = await Vehiculo.create({
            marca,
            modelo,
            anio,
            patente,
            color,
            kilometraje: kilometraje || 0,
            disponible: disponible ?? true
        });

        res.status(201).json({
            mensaje: 'Vehículo creado',
            id: vehiculo.id
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

exports.obtenerVehiculoPorId = async (req, res) => {

    try {

        const vehiculo = await Vehiculo.findByPk(
            req.params.id
        );

        if (!vehiculo) {
            return res.status(404).json({
                error: 'Vehículo no encontrado'
            });
        }

        res.json(vehiculo);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

exports.actualizarVehiculo = async (req, res) => {

    const {
        marca,
        modelo,
        anio,
        patente,
        color,
        kilometraje,
        disponible
    } = req.body;

    try {

        const vehiculo = await Vehiculo.findByPk(
            req.params.id
        );

        if (!vehiculo) {
            return res.status(404).json({
                error: 'Vehículo no encontrado'
            });
        }

        await vehiculo.update({
            marca,
            modelo,
            anio,
            patente,
            color,
            kilometraje,
            disponible
        });

        res.json({
            mensaje: 'Vehículo actualizado'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

exports.eliminarVehiculo = async (req, res) => {

    try {

        const vehiculo = await Vehiculo.findByPk(
            req.params.id
        );

        if (!vehiculo) {
            return res.status(404).json({
                error: 'Vehículo no encontrado'
            });
        }

        await vehiculo.destroy();

        res.json({
            mensaje: 'Vehículo eliminado'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};