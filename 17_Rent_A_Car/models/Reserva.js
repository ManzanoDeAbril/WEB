'use strict';

// ── models/Reserva.js — versión actualizada RQ-10 ─────────────────────────────
module.exports = (sequelize, DataTypes) => {

  const Reserva = sequelize.define('Reserva', {

    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    cliente_nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    estado: {
      type: DataTypes.STRING(20),
      defaultValue: 'pendiente'
    },

    // ── rq-06: kilometraje al entregar y al devolver ──────────────────────
    km_entrega: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    km_devolucion: {
      type: DataTypes.INTEGER,
      allowNull: true
    }

  }, {
    tableName: 'reservas'
  });

  Reserva.associate = function (models) {
    Reserva.belongsTo(models.Vehiculo, {
      foreignKey: 'vehiculo_id'
    });

    // ── rq-10: relación N:M con Extra vía ReservaExtra ────────────────────
    Reserva.belongsToMany(models.Extra, {
      through: 'ReservaExtra',
      foreignKey: 'reserva_id',
      otherKey: 'extra_id',
      as: 'extras'
    });

    // ── rq-10: una reserva puede tener una multa ──────────────────────────
    Reserva.hasOne(models.Multa, {
      foreignKey: 'reserva_id',
      as: 'multa'
    });
  };

  return Reserva;
};
