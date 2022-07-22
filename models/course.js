'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsToMany(models.User, {through: models.UserCourse})
    }
  }
  Course.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'name cannot be null'
        },
        notEmpty: {
          msg: 'name required'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'description cannot be null'
        },
        notEmpty: {
          msg: 'description required'
        }
      }
    },
    videoURL: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'videoURL cannot be null'
        },
        notEmpty: {
          msg: 'video required'
        }
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'category cannot be null'
        },
        notEmpty: {
          msg: 'category required'
        }
      }
    },
    imageURL: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'image URL cannot be null'
        },
        notEmpty: {
          msg: 'image URL cannot be empty'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};