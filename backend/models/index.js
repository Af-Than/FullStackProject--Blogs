'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
require('dotenv').config(); // Ensure .env is loaded

const basename = path.basename(__filename);
const models = {}; // Renamed to 'models' internally to prevent variable collision with imported modules

let sequelize;

// If DATABASE_URL is available in .env (Aiven MySQL URI), use it directly with SSL enabled
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for Aiven MySQL connection
      }
    },
    logging: false
  });
} else {
  // Fallback to config/config.json if DATABASE_URL is not set
  const env = process.env.NODE_ENV || 'development';
  const config = require(path.join(__dirname, '../config/config.json'))[env];
  
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }
}

// Load all model files in this directory
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

// Setup model associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;