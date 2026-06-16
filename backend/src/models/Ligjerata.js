const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Ligjerata = sequelize.define(
  "Ligjerata",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lectureName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lecturerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "lecture",
    timestamps: true,
  }
);

module.exports = Ligjerata;