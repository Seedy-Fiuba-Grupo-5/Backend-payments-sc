const Sequelize = require('sequelize');
const config = require("../config");

let db = new Sequelize(config.databaseURL, {
  dialect: 'postgres'
});

module.exports = { db };
