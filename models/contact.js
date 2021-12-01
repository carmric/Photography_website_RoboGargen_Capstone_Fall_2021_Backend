const Sequelize = require('sequelize');
const config = require('./../config');

const Contact = config.define("Contact", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false
    },

    email: {
        type: Sequelize.STRING,
        allowNull: false
    },

    phone: {
        type: Sequelize.STRING,
        allowNull: false
    },

    message: {
        type: Sequelize.STRING,
        allowNull: false
    },

    created_at: {
        type: Sequelize.DATE,
        allowNull: false
    }
// The below line of code is used to prevent Sequelize from adding extra columns to the table.
}, {timestamps: false});

module.exports = Contact;