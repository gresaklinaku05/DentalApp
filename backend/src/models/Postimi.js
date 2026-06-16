const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Postimi = sequelize.define(
  "Postimi",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    autherName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  },
  {
    tableName: "postimi",
    timestamps: true,
  }
);

module.exports = Postimi;
