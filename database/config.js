const {Sequelize} = require('sequelize');


const dbConnection = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD,
    {
        host: 'localhost',
        dialect: 'mssql',
    })

module.exports = {
    dbConnection
}