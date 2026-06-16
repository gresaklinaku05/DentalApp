const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const School = sequelize.define(
  "School",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    schoolName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "schools",
    timestamps: true,
  }
);

module.exports = School;
