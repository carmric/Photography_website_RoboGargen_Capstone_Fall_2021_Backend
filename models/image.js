const Sequelize = require('sequelize');
const config = require('../config');

const Image = config.define("Image", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    category_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    title: {
        type: Sequelize.STRING,
        allowNull: false
    },

    filename: {
        type: Sequelize.STRING,
        allowNull: false
    },

    created_at: {
        type: Sequelize.DATE,
        allowNull: false
    }
// The below line of code is used to prevent Sequelize from adding extra columns to the table.
}, {timestamps: false});

module.exports = Image;