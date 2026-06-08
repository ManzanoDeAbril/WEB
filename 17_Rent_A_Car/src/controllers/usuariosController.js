const { Usuario } = require('../../models');
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

        const usuarioExistente = await Usuario.findOne({
            where: { email }
        });

        if (usuarioExistente) {
            return res.status(409).json({
                error: 'El correo ya está registrado'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const usuario = await Usuario.create({
            nombre,
            email,
            password: passwordHash
        });

        res.status(201).json({
            mensaje: 'Usuario registrado',
            id: usuario.id
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

        const usuario = await Usuario.findOne({
            where: { email }
        });

        if (!usuario) {
            return res.status(401).json({
                error: 'Credenciales incorrectas'
            });
        }

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