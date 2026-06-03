const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registrarUsuario = async (req, res) => {

    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({
            error: 'Todos los campos son obligatorios'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            error: 'La contraseña debe tener al menos 6 caracteres'
        });
    }

    try {

        const [usuario] = await db.query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if (usuario.length > 0) {
            return res.status(409).json({
                error: 'El correo ya está registrado'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await db.query(`
            INSERT INTO usuarios
            (nombre, email, password, createdAt, updatedAt)
            VALUES (?, ?, ?, NOW(), NOW())
        `, [
            nombre,
            email,
            passwordHash
        ]);

        res.status(201).json({
            mensaje: 'Usuario registrado',
            id: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

exports.loginUsuario = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'Email y contraseña son obligatorios'
        });
    }

    try {

        const [usuarios] = await db.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                error: 'Credenciales incorrectas'
            });
        }

        const usuario = usuarios[0];

        const passwordValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValida) {
            return res.status(401).json({
                error: 'Credenciales incorrectas'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            process.env.JWT_SECRET || 'rentacar_secret_2026',
            {
                expiresIn: '24h'
            }
        );

        res.json({
            mensaje: 'Login correcto',
            token
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};