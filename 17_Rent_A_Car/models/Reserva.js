'use strict';

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
    }

  }, {
    tableName: 'reservas'
  });

    Reserva.associate = function(models) {
    Reserva.belongsTo(models.Vehiculo, {
      foreignKey: 'vehiculo_id'
    });
  };

  return Reserva;

};
