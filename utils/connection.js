require('pg')
require('pg-hstore')

const { Sequelize } = require('sequelize');
require('dotenv').config();

const databaseUrl = process.env[`DATABASE_URL_${process.env.NODE_ENV.toUpperCase()}`] || process.env.DATABASE_URL_PRODUCTION;

const sequelize = new Sequelize(databaseUrl)

module.exports = sequelize;
