"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const existingTables = await queryInterface.showAllTables();
    const hasTable = (name) => existingTables.includes(name) || existingTables.includes(name.toLowerCase());
    const hasColumn = async (table, column) => {
      const desc = await queryInterface.describeTable(table);
      return Boolean(desc[column]);
    };

    if (!hasTable("users")) {
      await queryInterface.createTable("users", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
        name: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false, unique: true },
        password: { type: Sequelize.STRING, allowNull: false },
        role: { type: Sequelize.ENUM("admin", "doctor", "staff"), allowNull: false, defaultValue: "admin" },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false },
      });
    } else if (!(await hasColumn("users", "role"))) {
      await queryInterface.addColumn("users", "role", {
        type: Sequelize.ENUM("admin", "doctor", "staff"),
        allowNull: false,
        defaultValue: "admin",
      });
    } else {
      await queryInterface.changeColumn("users", "role", {
        type: Sequelize.ENUM("admin", "doctor", "staff"),
        allowNull: false,
        defaultValue: "admin",
      });
    }

    if (!hasTable("patients")) {
      await queryInterface.createTable("patients", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
        fullName: { type: Sequelize.STRING, allowNull: false },
        phone: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: true },
        address: { type: Sequelize.STRING, allowNull: true },
        dateOfBirth: { type: Sequelize.DATEONLY, allowNull: true },
        notes: { type: Sequelize.TEXT, allowNull: true },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false },
      });
    }

    if (!hasTable("doctors")) {
      await queryInterface.createTable("doctors", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
        fullName: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false, unique: true },
        phone: { type: Sequelize.STRING, allowNull: false },
        specialty: { type: Sequelize.STRING, allowNull: false },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false },
      });
    }

    if (!hasTable("appointments")) {
      await queryInterface.createTable("appointments", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
        appointmentDate: { type: Sequelize.DATE, allowNull: false },
        reason: { type: Sequelize.STRING, allowNull: false },
        status: {
          type: Sequelize.ENUM("scheduled", "completed", "cancelled"),
          allowNull: false,
          defaultValue: "scheduled",
        },
        notes: { type: Sequelize.TEXT, allowNull: true },
        patientId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "patients", key: "id" },
          onDelete: "CASCADE",
        },
        doctorId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "doctors", key: "id" },
          onDelete: "RESTRICT",
        },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false },
      });
    } else {
      if (!(await hasColumn("appointments", "doctorId"))) {
        await queryInterface.addColumn("appointments", "doctorId", {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: "doctors", key: "id" },
          onDelete: "RESTRICT",
        });
      }
      if (!(await hasColumn("appointments", "patientId"))) {
        await queryInterface.addColumn("appointments", "patientId", {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: "patients", key: "id" },
          onDelete: "CASCADE",
        });
      }
    }

    if (!hasTable("patient_history")) {
      await queryInterface.createTable("patient_history", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
        visitDate: { type: Sequelize.DATE, allowNull: false },
        diagnosis: { type: Sequelize.STRING, allowNull: false },
        treatment: { type: Sequelize.STRING, allowNull: false },
        notes: { type: Sequelize.TEXT, allowNull: true },
        patientId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "patients", key: "id" },
          onDelete: "CASCADE",
        },
        doctorId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "doctors", key: "id" },
          onDelete: "RESTRICT",
        },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false },
      });
    }

    if (!hasTable("refresh_tokens")) {
      await queryInterface.createTable("refresh_tokens", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
        tokenHash: { type: Sequelize.STRING(255), allowNull: false, unique: true },
        expiresAt: { type: Sequelize.DATE, allowNull: false },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "users", key: "id" },
          onDelete: "CASCADE",
        },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false },
      });
    }

    if (!hasTable("audit_logs")) {
      await queryInterface.createTable("audit_logs", {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
        action: { type: Sequelize.STRING, allowNull: false },
        entity: { type: Sequelize.STRING, allowNull: false },
        entityId: { type: Sequelize.INTEGER, allowNull: true },
        timestamp: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: "users", key: "id" },
          onDelete: "SET NULL",
        },
      });
    }

    if (await hasColumn("appointments", "patientId")) {
      await queryInterface.addIndex("appointments", ["patientId"]).catch(() => null);
    }
    if (await hasColumn("appointments", "doctorId")) {
      await queryInterface.addIndex("appointments", ["doctorId"]).catch(() => null);
    }
    await queryInterface.addIndex("patient_history", ["patientId", "doctorId"]).catch(() => null);
    await queryInterface.addIndex("audit_logs", ["userId", "entity", "action", "timestamp"]).catch(() => null);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("audit_logs");
    await queryInterface.dropTable("refresh_tokens");
    await queryInterface.dropTable("patient_history");
    await queryInterface.dropTable("appointments");
    await queryInterface.dropTable("doctors");
    await queryInterface.dropTable("patients");
    await queryInterface.dropTable("users");
  },
};
