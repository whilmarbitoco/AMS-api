"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Attendance.init(
    {
      classID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Class",
          key: "id",
        },
      },
      studentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Student",
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        get() {
          const value = this.getDataValue("status");
          switch (value) {
            case "0":
              return "Absent";
            case "1":
              return "Present";
            case "2":
              return "Late";
            case "3":
              return "Excused";
            default:
              return null;
          }
        },
        set(value) {
          let statusValue;
          switch (value) {
            case "Absent":
              statusValue = 0;
              break;
            case "Present":
              statusValue = 1;
              break;
            case "Late":
              statusValue = 2;
              break;
            case "Excused":
              statusValue = 3;
              break;
            default:
              statusValue = null;
          }
          this.setDataValue("status", statusValue);
        },
      },
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );

  Attendance.associate = function (models) {
    Attendance.belongsTo(models.Student, {
      foreignKey: "studentID",
      onDelete: "CASCADE",
    });
    Attendance.belongsTo(models.Class, {
      foreignKey: "classID",
      onDelete: "CASCADE",
    });
  };

  return Attendance;
};
