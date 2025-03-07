"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get existing users to assign them as students
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE type = 2;`, // Select users with type "student"
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log(
        "No student-type users found. Make sure you seeded Users first."
      );
      return;
    }

    const students = users.map((user) => ({
      userID: user.id,
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      lrn: faker.string.numeric(12), // Generates a 12-digit random number
      strand: faker.helpers.arrayElement([
        "STEM",
        "ABM",
        "HUMSS",
        "TVL",
        "ICT",
      ]), // Random strand selection
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return queryInterface.bulkInsert("Students", students);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Students", null, {});
  },
};
