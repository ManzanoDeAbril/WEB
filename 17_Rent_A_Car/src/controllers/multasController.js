// src/controllers/multasController.js — rq-10: Multa por atraso
const { Multa, Reserva, Vehiculo, Extra } = require('../../models');

// Calcula días de atraso entre fecha_fin (pactada) y fecha_devolucion_real
const calcularDiasAtraso = (fechaFin, fechaDevolucionReal) => {
  const fin  = new Date(fechaFin);
  const real = new Date(fechaDevolucionReal);
  const diff = Math.floor((real - fin) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

// ── GET /multas ───────────────────────────────────────────────────────────────
exports.listarMultas = async (req, res) => {
  try {
    const multas = await Multa.findAll({
      include: [{
        model: Reserva,
        as: 'reserva',
        attributes: ['id', 'cliente_nombre', 'fecha_inicio', 'fecha_fin', 'vehiculo_id'],
        include: [{ model: Vehiculo, attributes: ['marca', 'modelo', 'patente'] }]
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(multas);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── GET /multas/:id ───────────────────────────────────────────────────────────
exports.obtenerMulta = async (req, res) => {
  try {
    const multa = await Multa.findByPk(req.params.id, {
      include: [{
        model: Reserva,
        as: 'reserva',
        include: [{ model: Vehiculo, attributes: ['marca', 'modelo', 'patente'] }]
      }]
    });
    if (!multa) return res.status(404).json({ mensaje: 'Multa no encontrada' });
    res.json(multa);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── POST /multas ──────────────────────────────────────────────────────────────
// Body: { reserva_id, fecha_devolucion_real, tarifa_por_dia, notas }
exports.crearMulta = async (req, res) => {
  const { reserva_id, fecha_devolucion_real, tarifa_por_dia, notas } = req.body;

  if (!reserva_id || !fecha_devolucion_real || tarifa_por_dia == null) {
    return res.status(422).json({
      error: true,
      message: 'Campos obligatorios: reserva_id, fecha_devolucion_real, tarifa_por_dia.',
      code: 'CAMPOS_REQUERIDOS'
    });
  }
  if (Number(tarifa_por_dia) <= 0) {
    return res.status(422).json({
      error: true,
      message: 'La tarifa por día debe ser mayor a 0.',
      code: 'TARIFA_INVALIDA'
    });
  }

  try {
    const reserva = await Reserva.findByPk(reserva_id);
    if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });

    // Validar que no exista ya una multa para esta reserva
    const existente = await Multa.findOne({ where: { reserva_id } });
    if (existente) {
      return res.status(409).json({
        error: true,
        message: 'Esta reserva ya tiene una multa registrada. Edítala en lugar de crear una nueva.',
        code: 'MULTA_DUPLICADA'
      });
    }

    const dias_atraso = calcularDiasAtraso(reserva.fecha_fin, fecha_devolucion_real);

    if (dias_atraso === 0) {
      return res.status(422).json({
        error: true,
        message: `La fecha de devolución real (${fecha_devolucion_real}) no es posterior a la fecha de fin pactada (${reserva.fecha_fin}). No hay atraso.`,
        code: 'SIN_ATRASO'
      });
    }

    const monto_total = +(dias_atraso * Number(tarifa_por_dia)).toFixed(2);

    const multa = await Multa.create({
      reserva_id,
      fecha_devolucion_real,
      dias_atraso,
      tarifa_por_dia: Number(tarifa_por_dia),
      monto_total,
      estado: 'pendiente',
      notas: notas || null
    });

    res.status(201).json({ mensaje: 'Multa registrada', multa });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── PUT /multas/:id ───────────────────────────────────────────────────────────
// Permite marcar como pagada, cambiar notas, o recalcular si se cambia fecha/tarifa
exports.actualizarMulta = async (req, res) => {
  try {
    const multa = await Multa.findByPk(req.params.id, {
      include: [{ model: Reserva, as: 'reserva' }]
    });
    if (!multa) return res.status(404).json({ mensaje: 'Multa no encontrada' });

    const { fecha_devolucion_real, tarifa_por_dia, estado, notas } = req.body;

    const nuevaFecha   = fecha_devolucion_real ?? multa.fecha_devolucion_real;
    const nuevaTarifa  = tarifa_por_dia != null ? Number(tarifa_por_dia) : Number(multa.tarifa_por_dia);
    const nuevasDias   = calcularDiasAtraso(multa.reserva.fecha_fin, nuevaFecha);
    const nuevoMonto   = +(nuevasDias * nuevaTarifa).toFixed(2);

    await multa.update({
      fecha_devolucion_real: nuevaFecha,
      tarifa_por_dia:        nuevaTarifa,
      dias_atraso:           nuevasDias,
      monto_total:           nuevoMonto,
      estado:                estado ?? multa.estado,
      notas:                 notas  != null ? notas : multa.notas
    });

    res.json({ mensaje: 'Multa actualizada', multa });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── DELETE /multas/:id ────────────────────────────────────────────────────────
exports.eliminarMulta = async (req, res) => {
  try {
    const multa = await Multa.findByPk(req.params.id);
    if (!multa) return res.status(404).json({ mensaje: 'Multa no encontrada' });
    await multa.destroy();
    res.json({ mensaje: 'Multa eliminada' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ── GET /reservas/:id/resumen ─────────────────────────────────────────────────
// Devuelve costo total: días × tarifa_base + extras + multa
exports.resumenReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id, {
      include: [
        { model: Vehiculo, attributes: ['marca', 'modelo', 'patente', 'kilometraje'] },
        { model: Extra, as: 'extras', through: { attributes: ['cantidad'] } },
        { model: Multa, as: 'multa' }
      ]
    });
    if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });

    // Días de la reserva (inclusivo)
    const inicio = new Date(reserva.fecha_inicio);
    const fin    = new Date(reserva.fecha_fin);
    const dias   = Math.max(1, Math.round((fin - inicio) / (1000 * 60 * 60 * 24)) + 1);

    // Costo de extras
    const costosExtras = reserva.extras.map(e => ({
      nombre:        e.nombre,
      precio_por_dia: Number(e.precio_por_dia),
      cantidad:      e.ReservaExtra.cantidad,
      subtotal:      +(Number(e.precio_por_dia) * e.ReservaExtra.cantidad * dias).toFixed(2)
    }));
    const totalExtras = +costosExtras.reduce((s, c) => s + c.subtotal, 0).toFixed(2);

    // Multa
    const multa = reserva.multa
      ? { dias_atraso: reserva.multa.dias_atraso, monto: Number(reserva.multa.monto_total), estado: reserva.multa.estado }
      : null;

    res.json({
      reserva_id:    reserva.id,
      cliente:       reserva.cliente_nombre,
      vehiculo:      reserva.Vehiculo,
      fecha_inicio:  reserva.fecha_inicio,
      fecha_fin:     reserva.fecha_fin,
      dias,
      estado:        reserva.estado,
      extras:        costosExtras,
      total_extras:  totalExtras,
      multa,
      total_multa:   multa ? multa.monto : 0,
      gran_total:    +(totalExtras + (multa ? multa.monto : 0)).toFixed(2)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
