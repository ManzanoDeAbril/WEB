const { Reserva } = require('../../models');

exports.obtenerReservas = async (req, res) => {
    try {

        const reservas = await Reserva.findAll();

        res.json(reservas);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

exports.crearReserva = async (req, res) => {

    const {
        vehiculo_id,
        cliente_nombre,
        fecha_inicio,
        fecha_fin,
        estado
    } = req.body;

    try {

        const reserva = await Reserva.create({
            vehiculo_id,
            cliente_nombre,
            fecha_inicio,
            fecha_fin,
            estado: estado || 'pendiente'
        });

        res.status(201).json({
            mensaje: 'Reserva creada',
            id: reserva.id
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

exports.obtenerReservaPorId = async (req, res) => {

    try {

        const reserva = await Reserva.findByPk(
            req.params.id
        );

        if (!reserva) {
            return res.status(404).json({
                mensaje: 'Reserva no encontrada'
            });
        }

        res.json(reserva);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

exports.actualizarReserva = async (req, res) => {

    const {
        vehiculo_id,
        cliente_nombre,
        fecha_inicio,
        fecha_fin,
        estado
    } = req.body;

    try {

        const reserva = await Reserva.findByPk(
            req.params.id
        );

        if (!reserva) {
            return res.status(404).json({
                mensaje: 'Reserva no encontrada'
            });
        }

        await reserva.update({
            vehiculo_id,
            cliente_nombre,
            fecha_inicio,
            fecha_fin,
            estado
        });

        res.json({
            mensaje: 'Reserva actualizada'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

exports.eliminarReserva = async (req, res) => {

    try {

        const reserva = await Reserva.findByPk(
            req.params.id
        );

        if (!reserva) {
            return res.status(404).json({
                mensaje: 'Reserva no encontrada'
            });
        }

        await reserva.destroy();

        res.json({
            mensaje: 'Reserva eliminada'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};