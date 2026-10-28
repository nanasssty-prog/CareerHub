'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vacancy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vacancy.init({
    title: DataTypes.STRING,
    companyName: DataTypes.STRING,
    description: DataTypes.STRING,
    location: DataTypes.STRING,
    employmentType: DataTypes.STRING,
    workplaceType: DataTypes.STRING,
    experienceLevel: DataTypes.STRING,
    skillsRequired: DataTypes.JSON,
    salary: DataTypes.JSON,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Vacancy',
  });
  return Vacancy;
};