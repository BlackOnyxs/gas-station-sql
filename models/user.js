const { DataTypes } = require('sequelize');
const { dbConnection } = require('../database/config');
const { RoleSchema } = require('./role');


const User = dbConnection.define('Colaborador', {
    codigo_cedula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    clave: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol: {
        type: DataTypes.STRING,
        model: RoleSchema,
        defaultValueValue: 'USER_ROLE',
        values: ['ADMIN_ROLE', 'USER_ROLE']
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    
}, {
    freezeTableName: true
});



module.exports = { User };
