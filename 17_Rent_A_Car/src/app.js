const express = require('express');
const db = require('./config/database');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensaje: 'Rent A Car API funcionando'
    });
});

// GET TODOS LOS VEHICULOS
app.get('/vehiculos', async (req, res) => {
    try {

        const [rows] = await db.query(
            'SELECT * FROM vehiculos'
        );

        res.json(rows);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});

// GET VEHICULO POR ID
app.get('/vehiculos/:id', async (req, res) => {

    try {

        const id = req.params.id;

        const query = 'SELECT * FROM vehiculos WHERE id = ?';

        const [rows] = await db.query(query, [id]);

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

});

// POST CREAR VEHICULO
app.post('/vehiculos', async (req, res) => {

    const {
        marca,
        modelo,
        anio,
        patente,
        color,
        kilometraje,
        disponible
    } = req.body;

    // VALIDACIÓN BÁSICA
    if (
        !marca ||
        !modelo ||
        !anio ||
        !patente ||
        !color ||
        kilometraje === undefined ||
        disponible === undefined
    ) {
        return res.status(400).json({
            error: 'Todos los campos son obligatorios'
        });
    }

    try {

        const query = `
            INSERT INTO vehiculos
            (marca, modelo, anio, patente, color, kilometraje, disponible)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            marca,
            modelo,
            anio,
            patente,
            color,
            kilometraje,
            disponible
        ]);

        res.status(201).json({
            mensaje: 'Vehículo creado correctamente',
            id: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

// PUT ACTUALIZAR VEHICULO
app.put('/vehiculos/:id', async (req, res) => {

    const id = req.params.id;

    const {
        marca,
        modelo,
        anio,
        patente,
        color,
        kilometraje,
        disponible
    } = req.body;

    // VALIDACIÓN
    if (
        !marca ||
        !modelo ||
        !anio ||
        !patente ||
        !color ||
        kilometraje === undefined ||
        disponible === undefined
    ) {
        return res.status(400).json({
            error: 'Todos los campos son obligatorios'
        });
    }

    try {

        const query = `
            UPDATE vehiculos
            SET
                marca = ?,
                modelo = ?,
                anio = ?,
                patente = ?,
                color = ?,
                kilometraje = ?,
                disponible = ?
            WHERE id = ?
        `;

        const [result] = await db.query(query, [
            marca,
            modelo,
            anio,
            patente,
            color,
            kilometraje,
            disponible,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Vehículo no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Vehículo actualizado correctamente',
            filas_afectadas: result.affectedRows
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

// DELETE VEHICULO
app.delete('/vehiculos/:id', async (req, res) => {

    const id = req.params.id;

    try {

        const query = 'DELETE FROM vehiculos WHERE id = ?';

        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Vehículo no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Vehículo eliminado correctamente',
            filas_afectadas: result.affectedRows
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});