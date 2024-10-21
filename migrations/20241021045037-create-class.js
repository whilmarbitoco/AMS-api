'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Classes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      teacherID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Teachers',
          key: 'id'
        }
      },
      timeIn: {
        type: Sequelize.TIME,
        allowNull: false
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
    await queryInterface.dropTable('Classes');
  }
};