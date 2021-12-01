let database = 'photography_website';
let username = 'carmen';
let password = 'password';
let host = 'localhost';

// 'Sequelize' on the below 2 lines of code is supposed to be green... Why are they not green???
const Sequelize = require('sequelize');
const config =  new Sequelize(database, username, password, {
    host: host,
    dialect: 'mysql'
});

module.exports = config;