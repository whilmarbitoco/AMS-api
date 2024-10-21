'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Class.init({
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    teacherID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Teacher',
        key: 'id'
      }
    },
    timeIn: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Class',
  });

  Class.associate = function(models) {
    Class.belongsTo(models.Teacher, {
      foreignKey: 'teacherID',
      onDelete: 'CASCADE'
    })
  }

  return Class;
};