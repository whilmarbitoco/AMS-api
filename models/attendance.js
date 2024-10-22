'use strict';
const {
  Model
} = require('sequelize');
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
  Attendance.init({
    classID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Class',
        key: 'id'
      }
    },
    studentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Student',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('present', 'absent'),
      allowNull: false,
      defaultValue: 'absent'
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });

  Attendance.associate = function(models) {
    Attendance.belongsTo(models.Student, { foreignKey: 'studentID', onDelete: 'CASCADE' });
    Attendance.belongsTo(models.Class, { foreignKey: 'classID', onDelete: 'CASCADE' });
  };

  return Attendance;
};