'use strict';

module.exports = (sequelize, DataTypes) => {

  const Extra = sequelize.define('Extra', {
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    precio_por_dia: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'extras'
  });

  Extra.associate = function (models) {
    Extra.belongsToMany(models.Reserva, {
      through: 'ReservaExtra',
      foreignKey: 'extra_id',
      otherKey: 'reserva_id',
      as: 'reservas'
    });
  };

  return Extra;
};
