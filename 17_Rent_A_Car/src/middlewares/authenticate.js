const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: 'Token no proporcionado'
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Token inválido'
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'rentacar_secret_2026'
        );

        req.usuario = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            error: 'Token inválido o expirado'
        });

    }

};