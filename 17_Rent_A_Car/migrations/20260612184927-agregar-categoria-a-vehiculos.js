'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(
      'vehiculos',
      'categoria',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Sedán'
      }
    );

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn(
      'vehiculos',
      'categoria'
    );

  }
};