const { Reserva } = require('../../models');
const { Op } = require('sequelize');

// ── Helper rq-05: detecta reservas solapadas ─────────────────────────────────
const reservaSolapada = async (vehiculo_id, fecha_inicio, fecha_fin, excluirId = null) => {
  const where = {
    vehiculo_id,
    estado: { [Op.ne]: 'cancelada' },
    fecha_inicio: { [Op.lte]: fecha_fin },
    fecha_fin:    { [Op.gte]: fecha_inicio }
  };
  if (excluirId) where.id = { [Op.ne]: excluirId };
  return await Reserva.findOne({ where });
};

// ── Helper rq-06: valida kilometraje ─────────────────────────────────────────
const validarKilometraje = (km_entrega, km_devolucion) => {
  if (km_entrega != null && km_devolucion != null) {
    if (Number(km_devolucion) < Number(km_entrega)) {
      return {
        error: true,
        message: `El kilometraje de devolución (${km_devolucion} km) no puede ser menor al de entrega (${km_entrega} km).`,
        code: 'KM_DEVOLUCION_INVALIDO'
      };
    }
  }
  return null;
};

// ── GET /reservas ─────────────────────────────────────────────────────────────
exports.obtenerReservas = async (req, res) => {
  try {
    const reservas = await Reserva.findAll();
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── POST /reservas ────────────────────────────────────────────────────────────
exports.crearReserva = async (req, res) => {
  const { vehiculo_id, cliente_nombre, fecha_inicio, fecha_fin, estado, km_entrega, km_devolucion } = req.body;

  // Validar fechas
  if (!fecha_inicio || !fecha_fin) {
    return res.status(422).json({ error: true, message: 'Las fechas de inicio y fin son obligatorias.', code: 'FECHAS_REQUERIDAS' });
  }
  if (fecha_inicio > fecha_fin) {
    return res.status(422).json({ error: true, message: 'La fecha de inicio no puede ser posterior a la fecha de fin.', code: 'FECHAS_INVALIDAS' });
  }

  // ── rq-06: validar kilometraje
  const errorKm = validarKilometraje(km_entrega, km_devolucion);
  if (errorKm) return res.status(422).json(errorKm);

  try {
    // ── rq-05: validar solapamiento
    const conflicto = await reservaSolapada(vehiculo_id, fecha_inicio, fecha_fin);
    if (conflicto) {
      return res.status(409).json({
        error: true,
        message: `El vehículo ya tiene una reserva activa entre ${conflicto.fecha_inicio} y ${conflicto.fecha_fin}. Por favor elige otras fechas.`,
        code: 'RESERVA_SOLAPADA'
      });
    }

    const reserva = await Reserva.create({
      vehiculo_id,
      cliente_nombre,
      fecha_inicio,
      fecha_fin,
      estado: estado || 'pendiente',
      km_entrega:    km_entrega    ?? null,
      km_devolucion: km_devolucion ?? null
    });

    res.status(201).json({ mensaje: 'Reserva creada', id: reserva.id });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── GET /reservas/:id ─────────────────────────────────────────────────────────
exports.obtenerReservaPorId = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── PUT /reservas/:id ─────────────────────────────────────────────────────────
exports.actualizarReserva = async (req, res) => {
  const { vehiculo_id, cliente_nombre, fecha_inicio, fecha_fin, estado, km_entrega, km_devolucion } = req.body;

  // Validar fechas
  if (fecha_inicio && fecha_fin && fecha_inicio > fecha_fin) {
    return res.status(422).json({ error: true, message: 'La fecha de inicio no puede ser posterior a la fecha de fin.', code: 'FECHAS_INVALIDAS' });
  }

  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });

    // ── rq-06: usar valores nuevos o los ya guardados para la validación
    const kmEntregaFinal    = km_entrega    != null ? km_entrega    : reserva.km_entrega;
    const kmDevolucionFinal = km_devolucion != null ? km_devolucion : reserva.km_devolucion;

    const errorKm = validarKilometraje(kmEntregaFinal, kmDevolucionFinal);
    if (errorKm) return res.status(422).json(errorKm);

    // ── rq-05: validar solapamiento excluyendo esta misma reserva
    const fInicio = fecha_inicio || reserva.fecha_inicio;
    const fFin    = fecha_fin    || reserva.fecha_fin;
    const vId     = vehiculo_id  || reserva.vehiculo_id;

    const conflicto = await reservaSolapada(vId, fInicio, fFin, req.params.id);
    if (conflicto) {
      return res.status(409).json({
        error: true,
        message: `El vehículo ya tiene una reserva activa entre ${conflicto.fecha_inicio} y ${conflicto.fecha_fin}. Por favor elige otras fechas.`,
        code: 'RESERVA_SOLAPADA'
      });
    }

    await reserva.update({
      vehiculo_id,
      cliente_nombre,
      fecha_inicio,
      fecha_fin,
      estado,
      km_entrega:    km_entrega    ?? reserva.km_entrega,
      km_devolucion: km_devolucion ?? reserva.km_devolucion
    });

    res.json({ mensaje: 'Reserva actualizada' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── DELETE /reservas/:id ──────────────────────────────────────────────────────
exports.eliminarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    await reserva.destroy();
    res.json({ mensaje: 'Reserva eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};