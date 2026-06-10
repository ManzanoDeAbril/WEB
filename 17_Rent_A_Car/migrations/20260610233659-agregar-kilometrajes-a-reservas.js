'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reservas', 'km_entrega', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('reservas', 'km_devolucion', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('reservas', 'km_entrega');
    await queryInterface.removeColumn('reservas', 'km_devolucion');
  }
};