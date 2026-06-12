'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehiculo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
static associate(models) {
  Vehiculo.hasMany(models.Reserva, {
    foreignKey: 'vehiculo_id'
  });
}
  }
  Vehiculo.init({

    categoria: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Sedán'
    },
    
    marca: DataTypes.STRING,
    modelo: DataTypes.STRING,
    anio: DataTypes.INTEGER,
    patente: DataTypes.STRING,
    color: DataTypes.STRING,
    kilometraje: DataTypes.INTEGER,
    disponible: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Vehiculo',
  });
  return Vehiculo;
};



