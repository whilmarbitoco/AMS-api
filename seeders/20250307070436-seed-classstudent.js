"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const students = await queryInterface.sequelize.query(
      `SELECT id FROM "Students";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const classStudents = students.map((student) => ({
      classID: 2, // Assign a random class
      studentID: student.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return queryInterface.bulkInsert("ClassStudents", classStudents);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("ClassStudents", null, {});
  },
};
