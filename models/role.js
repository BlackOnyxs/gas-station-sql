const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config');


const RoleSchema = dbConnection.define('Role', {
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    }

});

module.exports = { RoleSchema };