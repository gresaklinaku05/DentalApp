"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("lecturer", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      lecturerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      department: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
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

    await queryInterface.createTable("lecture", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      lectureName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lecturerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "lecturer",
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
    await queryInterface.dropTable("lecture");
    await queryInterface.dropTable("lecturer");
  },
};