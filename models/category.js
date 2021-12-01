const Sequelize = require('sequelize');
const config = require('../config');

const Category = config.define("Category", {
    id: {
        type: Sequelize.INTEGER,
        autoincrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }

// The below line of code is used to prevent Sequelize from adding extra columns to the table.
}, {timestamps: false});

module.exports = Category;