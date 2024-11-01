"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        get() {
          const type = this.getDataValue("type");
          switch (type) {
            case 0:
              return "admin";
            case 1:
              return "teacher";
            case 2:
              return "student";
            default:
              return null;
          }
        },
        set(value) {
          switch (value) {
            case "admin":
              this.setDataValue("type", 0);
              break;
            case "teacher":
              this.setDataValue("type", 1);
              break;
            case "student":
              this.setDataValue("type", 2);
              break;
            default:
              this.setDataValue("type", null);
          }
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
