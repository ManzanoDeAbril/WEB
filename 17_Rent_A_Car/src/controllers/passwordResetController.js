const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { Usuario, PasswordResetToken } = require('../../models');

// POST /auth/solicitar-reset
// Body: { email }
exports.solicitarReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El email es obligatorio' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    // Respuesta genérica para no revelar si el email existe
    if (!usuario) {
      return res.json({
        mensaje: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña'
      });
    }

    // Invalidar tokens anteriores del mismo email
    await PasswordResetToken.update(
      { used: true },
      { where: { email, used: false } }
    );

    // Generar token seguro
    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await PasswordResetToken.create({ email, token, expires_at });

    // Modo desarrollo: mostrar token en respuesta y en consola
    console.log(`[DEV] Token de restablecimiento para ${email}: ${token}`);

    return res.json({
      mensaje: 'Token generado correctamente',
      // Se incluye en respuesta para modo desarrollo (sin email real)
      token_dev: token,
      expira_en: '1 hora'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /auth/restablecer-password
// Body: { token, nueva_password }
exports.restablecerPassword = async (req, res) => {
  const { token, nueva_password } = req.body;

  if (!token || !nueva_password) {
    return res.status(400).json({ error: 'Token y nueva contraseña son obligatorios' });
  }

  if (nueva_password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const registro = await PasswordResetToken.findOne({ where: { token } });

    if (!registro) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    if (registro.used) {
      return res.status(400).json({ error: 'Este token ya fue utilizado' });
    }

    if (new Date() > new Date(registro.expires_at)) {
      return res.status(400).json({ error: 'El token ha expirado. Solicita uno nuevo.' });
    }

    // Actualizar contraseña (hasheada)
    const passwordHash = await bcrypt.hash(nueva_password, 10);
    await Usuario.update(
      { password: passwordHash },
      { where: { email: registro.email } }
    );

    // Marcar token como usado
    await registro.update({ used: true });

    return res.json({ mensaje: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};