// src/controllers/extrasController.js — rq-10: Extras
const { Extra, Reserva, ReservaExtra } = require('../../models');

// ── GET /extras ───────────────────────────────────────────────────────────────
exports.listarExtras = async (req, res) => {
  try {
    const extras = await Extra.findAll({ order: [['nombre', 'ASC']] });
    res.json(extras);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── POST /extras ──────────────────────────────────────────────────────────────
exports.crearExtra = async (req, res) => {
  const { nombre, descripcion, precio_por_dia } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(422).json({ error: true, message: 'El nombre del extra es obligatorio.', code: 'NOMBRE_REQUERIDO' });
  }
  if (precio_por_dia == null || Number(precio_por_dia) < 0) {
    return res.status(422).json({ error: true, message: 'El precio por día debe ser un número mayor o igual a 0.', code: 'PRECIO_INVALIDO' });
  }

  try {
    const extra = await Extra.create({
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || null,
      precio_por_dia: Number(precio_por_dia),
      activo: true
    });
    res.status(201).json({ mensaje: 'Extra creado', id: extra.id, extra });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── PUT /extras/:id ───────────────────────────────────────────────────────────
exports.actualizarExtra = async (req, res) => {
  try {
    const extra = await Extra.findByPk(req.params.id);
    if (!extra) return res.status(404).json({ mensaje: 'Extra no encontrado' });

    const { nombre, descripcion, precio_por_dia, activo } = req.body;

    if (precio_por_dia != null && Number(precio_por_dia) < 0) {
      return res.status(422).json({ error: true, message: 'El precio por día no puede ser negativo.', code: 'PRECIO_INVALIDO' });
    }

    await extra.update({
      nombre:        nombre        != null ? nombre.trim()         : extra.nombre,
      descripcion:   descripcion   != null ? descripcion.trim()    : extra.descripcion,
      precio_por_dia: precio_por_dia != null ? Number(precio_por_dia) : extra.precio_por_dia,
      activo:        activo        != null ? activo                : extra.activo
    });

    res.json({ mensaje: 'Extra actualizado', extra });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── DELETE /extras/:id ────────────────────────────────────────────────────────
exports.eliminarExtra = async (req, res) => {
  try {
    const extra = await Extra.findByPk(req.params.id);
    if (!extra) return res.status(404).json({ mensaje: 'Extra no encontrado' });
    await extra.destroy();
    res.json({ mensaje: 'Extra eliminado' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── GET /reservas/:id/extras ──────────────────────────────────────────────────
exports.listarExtrasDeReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id, {
      include: [{ model: Extra, as: 'extras', through: { attributes: ['cantidad'] } }]
    });
    if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    res.json(reserva.extras);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── POST /reservas/:id/extras ─────────────────────────────────────────────────
// Body: { extra_id, cantidad }
exports.agregarExtraAReserva = async (req, res) => {
  const { extra_id, cantidad } = req.body;

  if (!extra_id) {
    return res.status(422).json({ error: true, message: 'extra_id es obligatorio.', code: 'EXTRA_ID_REQUERIDO' });
  }

  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });

    const extra = await Extra.findByPk(extra_id);
    if (!extra) return res.status(404).json({ mensaje: 'Extra no encontrado' });

    // Si ya existe la combinación, actualiza la cantidad
    const [re, created] = await ReservaExtra.findOrCreate({
      where: { reserva_id: reserva.id, extra_id },
      defaults: { cantidad: cantidad ?? 1 }
    });

    if (!created) {
      await re.update({ cantidad: cantidad ?? re.cantidad });
    }

    res.status(201).json({ mensaje: created ? 'Extra agregado a la reserva' : 'Cantidad actualizada', re });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── DELETE /reservas/:id/extras/:extraId ──────────────────────────────────────
exports.quitarExtraDeReserva = async (req, res) => {
  try {
    const deleted = await ReservaExtra.destroy({
      where: { reserva_id: req.params.id, extra_id: req.params.extraId }
    });
    if (!deleted) return res.status(404).json({ mensaje: 'Asignación no encontrada' });
    res.json({ mensaje: 'Extra removido de la reserva' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
