'use strict';

module.exports = (sequelize, DataTypes) => {

  const ReservaExtra = sequelize.define('ReservaExtra', {
    reserva_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    extra_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    tableName: 'reserva_extras'
  });

  return ReservaExtra;
};
