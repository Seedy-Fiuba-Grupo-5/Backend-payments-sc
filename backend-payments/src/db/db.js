const Sequelize = require('sequelize');
const { node_env, databaseURL } = require("../config");

let db = null;


if (node_env === 'development') {
  db = new Sequelize(databaseURL, {
    dialect: 'postgres'
  });
}

if (node_env === 'production') {
  db = new Sequelize(databaseURL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
}

module.exports = { db };
