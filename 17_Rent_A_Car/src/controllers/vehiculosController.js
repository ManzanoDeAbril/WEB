const { Vehiculo, Reserva } = require('../../models');
const { Op } = require('sequelize');

exports.obtenerVehiculos = async (req, res, next) => {

  try {

    const vehiculos = await Vehiculo.findAll();

    res.json(vehiculos);

  } catch (error) {

    next(error);

  }

};
exports.crearVehiculo = async (req, res) => {
    
const {
    marca,
    modelo,
    anio,
    patente,
    categoria,
    color,
    kilometraje,
    disponible
} = req.body;

  if (!marca || !modelo || !anio || !patente) {
    return res.status(400).json({
      error: true,
      message: 'Faltan campos obligatorios'
    });
  }

  if (
    !Number.isInteger(Number(anio)) ||
    anio < 1900 ||
    anio > new Date().getFullYear() + 1
  ) {
    return res.status(422).json({
      error: true,
      message: 'Año inválido'
    });
  }

  try {

    const existe = await Vehiculo.findOne({
      where: { patente }
    });

    if (existe) {
      return res.status(409).json({
        error: true,
        message: 'La patente ya está registrada'
      });
    }

const vehiculo = await Vehiculo.create({
    marca,
    modelo,
    anio,
    patente,
    categoria,
    color,
    kilometraje: kilometraje || 0,
    disponible: disponible ?? true
});
    res.status(201).json({
      mensaje: 'Vehículo creado',
      id: vehiculo.id
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

exports.obtenerVehiculoPorId = async (req, res) => {

    try {

        const vehiculo = await Vehiculo.findByPk(
            req.params.id
        );

        if (!vehiculo) {
            return res.status(404).json({
                error: 'Vehículo no encontrado'
            });
        }

        res.json(vehiculo);

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
    categoria,
    color,
    kilometraje,
    disponible
} = req.body;

    try {

        const vehiculo = await Vehiculo.findByPk(
            req.params.id
        );

        if (!vehiculo) {
            return res.status(404).json({
                error: 'Vehículo no encontrado'
            });
        }

await vehiculo.update({
    marca,
    modelo,
    anio,
    patente,
    categoria,
    color,
    kilometraje,
    disponible
});

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

        const vehiculo = await Vehiculo.findByPk(
            req.params.id
        );

        if (!vehiculo) {
            return res.status(404).json({
                error: 'Vehículo no encontrado'
            });
        }

        await vehiculo.destroy();

        res.json({
            mensaje: 'Vehículo eliminado'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

// rq-07: Disponibilidad por fechas
exports.buscarDisponibles = async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;

  if (!fecha_inicio || !fecha_fin) {
    return res.status(400).json({
      error: 'Parámetros requeridos: fecha_inicio y fecha_fin (YYYY-MM-DD)',
    });
  }

  if (new Date(fecha_inicio) >= new Date(fecha_fin)) {
    return res.status(400).json({
      error: 'fecha_inicio debe ser anterior a fecha_fin',
    });
  }

  try {
    // IDs de vehículos con reservas activas que se solapan con el rango
    const reservasSolapadas = await Reserva.findAll({
      attributes: ['vehiculo_id'],
      where: {
        estado: { [Op.ne]: 'cancelada' },
        fecha_inicio: { [Op.lt]: fecha_fin },
        fecha_fin:    { [Op.gt]: fecha_inicio },
      },
      raw: true,
    });

    const idsOcupados = reservasSolapadas.map((r) => r.vehiculo_id);

    const vehiculosDisponibles = await Vehiculo.findAll({
      where: idsOcupados.length
        ? { id: { [Op.notIn]: idsOcupados } }
        : {},
    });

    return res.json({
      fecha_inicio,
      fecha_fin,
      total: vehiculosDisponibles.length,
      vehiculos: vehiculosDisponibles,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al consultar disponibilidad' });
  }
};