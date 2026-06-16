const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Ligjëruesi = sequelize.define(
  "Ligjëruesi",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lecturerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "lecturer",
    timestamps: true,
  }
);

module.exports = Ligjëruesi;