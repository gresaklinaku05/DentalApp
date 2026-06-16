const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Factory = sequelize.define(
  "Factory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    factoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "factories",
    timestamps: true,
  }
);

module.exports = Factory;
