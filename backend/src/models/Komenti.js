const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Komenti = sequelize.define(
  "Komenti",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postimiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "komenti",
    timestamps: true,
  }
);

module.exports = Komenti;
