'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('multas', {
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
      fecha_devolucion_real: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      dias_atraso: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      tarifa_por_dia: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      monto_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      estado: {
        // 'pendiente' | 'pagada'
        type: Sequelize.STRING(20),
        defaultValue: 'pendiente'
      },
      notas: {
        type: Sequelize.STRING(255),
        allowNull: true
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
    await queryInterface.dropTable('multas');
  }
};
