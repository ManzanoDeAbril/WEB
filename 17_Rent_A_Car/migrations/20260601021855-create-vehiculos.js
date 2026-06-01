'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehiculos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      marca: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      modelo: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      anio: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      patente: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      color: {
        type: Sequelize.STRING(50)
      },
      kilometraje: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      disponible: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vehiculos');
  }
};