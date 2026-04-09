"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "role", {
      type: Sequelize.ENUM("admin", "doctor", "staff"),
      allowNull: false,
      defaultValue: "admin",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "role", {
      type: Sequelize.ENUM("admin", "staff"),
      allowNull: false,
      defaultValue: "admin",
    });
  },
};
