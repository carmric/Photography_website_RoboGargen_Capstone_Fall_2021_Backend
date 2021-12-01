const Sequelize = require('sequelize');
const config = require('../config');

const User = config.define("User", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false
    }
// The below line of code is used to prevent Sequelize from adding extra columns to the table. 
}, {timestamps: false});

module.exports = User;