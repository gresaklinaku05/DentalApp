const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Library = sequelize.define(
  "Library",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    libraryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "libraries",
    timestamps: true,
  }
);

module.exports = Library;
