const Sequelize = require('sequelize');
const { nodeENV, databaseURL } = require("../config");

let db = null;

if (nodeENV === 'development') {
  db = new Sequelize(databaseURL, {
    dialect: 'postgres'
  });
}

if (nodeENV === 'production') {
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
