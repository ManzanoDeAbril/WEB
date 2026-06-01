'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reservas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      vehiculo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vehiculos',
          key: 'id'
        }
      },

      cliente_nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },

      fecha_inicio: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      fecha_fin: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      estado: {
        type: Sequelize.STRING(20),
        defaultValue: 'pendiente'
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
    await queryInterface.dropTable('reservas');
  }
};