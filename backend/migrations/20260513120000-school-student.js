"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("schools", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      schoolName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("students", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      studentName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      class: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      schoolId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "schools",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("students");
    await queryInterface.dropTable("schools");
  },
};
