const db = require('../config/database');

exports.obtenerVehiculos = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vehiculos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        const query = `
            INSERT INTO vehiculos
            (marca, modelo, anio, patente, color, kilometraje, disponible, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `;

        
        const [result] = await db.query(query, [
            marca,
            modelo,
            anio,
            patente,
            color,
            kilometraje || 0,
            disponible ?? true
        ]);     
        

        res.status(201).json({
            mensaje: 'Vehículo creado',
            id: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

exports.obtenerVehiculoPorId = async (req, res) => {

    try {

        const [rows] = await db.query(
            'SELECT * FROM vehiculos WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: 'Vehículo no encontrado'
            });
        }

        res.json(rows[0]);

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

        const [result] = await db.query(
            `UPDATE vehiculos
             SET marca = ?,
                 modelo = ?,
                 anio = ?,
                 patente = ?,
                 color = ?,
                 kilometraje = ?,
                 disponible = ?,
                 updatedAt = NOW()
             WHERE id = ?`,
            [
                marca,
                modelo,
                anio,
                patente,
                color,
                kilometraje,
                disponible,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Vehículo no encontrado'
            });
        }

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

        const [result] = await db.query(
            'DELETE FROM vehiculos WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Vehículo no encontrado'
            });
        }

        res.json({
            mensaje: 'Vehículo eliminado'
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};