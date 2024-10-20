'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Teacher.init({
    userID: {
      type: DataTypes.INTEGER,
      unique: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Teacher',
  });

  Teacher.associate = function(models) {
    Teacher.belongsTo(models.User, {
      foreignKey: 'userID',
      onDelete: 'CASCADE'
    });
  };

  return Teacher;
};