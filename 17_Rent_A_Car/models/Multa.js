'use strict';

module.exports = (sequelize, DataTypes) => {

  const Multa = sequelize.define('Multa', {
    reserva_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_devolucion_real: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    dias_atraso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tarifa_por_dia: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    monto_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    estado: {
      type: DataTypes.STRING(20),
      defaultValue: 'pendiente'   // 'pendiente' | 'pagada'
    },
    notas: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'multas'
  });

  Multa.associate = function (models) {
    Multa.belongsTo(models.Reserva, {
      foreignKey: 'reserva_id',
      as: 'reserva'
    });
  };

  return Multa;
};
