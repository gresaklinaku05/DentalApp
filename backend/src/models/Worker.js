const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Worker = sequelize.define(
  "Worker",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    factoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "workers",
    timestamps: true,
  }
);

module.exports = Worker;
