'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserProfile)
      User.belongsToMany(models.Course, {through: models.UserCourse})
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'username cannot be null'
        },
        notEmpty: {
          msg: 'username required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'password cannot be null'
        },
        notEmpty: {
          msg: 'password required'
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'type cannot be null'
        },
        notEmpty: {
          msg: 'type required'
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'role cannot be null'
        },
        notEmpty: {
          msg: 'role required'
        }
      }
    }
  }, {
    hooks: {
      beforeUpdate(instance,option){
        const salt = bcrypt.genSaltSync(8);
        const hash = bcrypt.hashSync(instance.password, salt);

        instance.password = hash
      },
      beforeCreate(instance, option){
        const salt = bcrypt.genSaltSync(8);
        const hash = bcrypt.hashSync(instance.password, salt);

        instance.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};