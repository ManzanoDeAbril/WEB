// rq-08: Panel principal — flota y reservas
const { Vehiculo, Reserva } = require('../../models');
const { Op } = require('sequelize');

exports.obtenerPanel = async (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];

        // ── Flota ──────────────────────────────────────────────────────────────
        const totalVehiculos = await Vehiculo.count();

        // Vehículos con al menos una reserva activa que incluye hoy
        const reservasActivasHoy = await Reserva.findAll({
            attributes: ['vehiculo_id'],
            where: {
                estado:       { [Op.ne]: 'cancelada' },
                fecha_inicio: { [Op.lte]: hoy },
                fecha_fin:    { [Op.gte]: hoy }
            },
            raw: true
        });
        const idsOcupadosHoy  = [...new Set(reservasActivasHoy.map(r => r.vehiculo_id))];
        const vehiculosLibres = totalVehiculos - idsOcupadosHoy.length;

        // ── Reservas ───────────────────────────────────────────────────────────
        const totalReservas      = await Reserva.count();
        const reservasPendientes = await Reserva.count({ where: { estado: 'pendiente'  } });
        const reservasConfirm    = await Reserva.count({ where: { estado: 'confirmada' } });
        const reservasCanceladas = await Reserva.count({ where: { estado: 'cancelada'  } });

        // Últimas 5 reservas
        const ultimasReservas = await Reserva.findAll({
            limit:   5,
            order:   [['createdAt', 'DESC']],
            include: [{ model: Vehiculo, attributes: ['marca', 'modelo', 'patente'] }]
        });

        res.json({
            flota: {
                total:    totalVehiculos,
                libres:   vehiculosLibres,
                ocupados: idsOcupadosHoy.length
            },
            reservas: {
                total:       totalReservas,
                pendientes:  reservasPendientes,
                confirmadas: reservasConfirm,
                canceladas:  reservasCanceladas
            },
            ultimasReservas
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};