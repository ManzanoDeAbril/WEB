const db = require('../config/database');

exports.obtenerReservas = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM reservas');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        const query = `
        INSERT INTO reservas
        (
            vehiculo_id,
            cliente_nombre,
            fecha_inicio,
            fecha_fin,
            estado,
            createdAt,
            updatedAt
        )
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `;

        const [result] = await db.query(query, [
            vehiculo_id,
            cliente_nombre,
            fecha_inicio,
            fecha_fin,
            estado || 'pendiente'
        ]);

        res.status(201).json({
            mensaje: 'Reserva creada',
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.obtenerReservaPorId = async (req, res) => {

    try {

        const [rows] = await db.query(
            'SELECT * FROM reservas WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Reserva no encontrada'
            });
        }

        res.json(rows[0]);

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

        await db.query(`
            UPDATE reservas
            SET
                vehiculo_id = ?,
                cliente_nombre = ?,
                fecha_inicio = ?,
                fecha_fin = ?,
                estado = ?,
                updatedAt = NOW()
            WHERE id = ?
        `, [
            vehiculo_id,
            cliente_nombre,
            fecha_inicio,
            fecha_fin,
            estado,
            req.params.id
        ]);

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

        await db.query(
            'DELETE FROM reservas WHERE id = ?',
            [req.params.id]
        );

        res.json({
            mensaje: 'Reserva eliminada'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};