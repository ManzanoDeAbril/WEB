'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reserva_extras', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      reserva_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'reservas', key: 'id' },
        onDelete: 'CASCADE'
      },
      extra_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'extras', key: 'id' },
        onDelete: 'CASCADE'
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
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

  async down(queryInterface) {
    await queryInterface.dropTable('reserva_extras');
  }
};
