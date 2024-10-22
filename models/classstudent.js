'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClassStudent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ClassStudent.init({
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
    }
  }, {
    sequelize,
    modelName: 'ClassStudent',
  });

  ClassStudent.associate = function(models) {
    ClassStudent.belongsTo(models.Class, {
      foreignKey: 'classID',
      onDelete: 'CASCADE'
    });
  }

  ClassStudent.associate = function(models) {
    ClassStudent.belongsTo(models.Student, {
      foreignKey: 'studentID',
      onDelete: 'CASCADE'
    });
  };

  return ClassStudent;
};