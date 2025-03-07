"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get existing student IDs
    const students = await queryInterface.sequelize.query(
      `SELECT id FROM "Students";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (students.length === 0) {
      console.log("No students found. Make sure you seeded Students first.");
      return;
    }

    const attendanceRecords = students.map((student) => ({
      classID: 2, // Fixed class ID
      studentID: student.id,
      date: faker.date.recent({ days: 30 }).toISOString().split("T")[0], // Random date in the last 30 days
      status: Math.floor(Math.random() * 4), // Random status (0 - Absent, 1 - Present, 2 - Late, 3 - Excused)
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return queryInterface.bulkInsert("Attendances", attendanceRecords);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Attendances", null, {});
  },
};
