const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    schoolId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "students",
    timestamps: true,
  }
);

module.exports = Student;
