
const express  = require('express');
const cors     = require('cors');
const http     = require('http');
const socketio = require('socket.io');

const { dbConnection } = require('../database/config');
const Sockets = require('./sockets');

class Server {

    constructor() {
        this.app = express();
        this.port =  process.env.PORT;

        this.server = http.createServer( this.app );

        this.paths = {
            auth: '/api/auth',
            buyInvoice: '/api/buyinvoice',
            client: '/api/clients',
            fuels: '/api/fuels',
            oils: '/api/oils',
            providers: '/api/providers',
            sellInvoice: '/api/sellinvoice',
            schedule: '/api/schedule',
            turn: '/api/turns',
            users: '/api/users',
        };

        this.io = socketio( this.server, {})

        //DB connection
        this.dbConnection();

        //middlewares
        this.middlewares();

        //Routes
        this.routes();
    }

    async dbConnection(){
        try {
            await dbConnection.authenticate();
            console.log('DB online')
        } catch (error) {
            throw new Error( error );
        }
        
    }

    middlewares() {

        //Json parse
        this.app.use( express.json() );

        //cors
        this.app.use( cors() );
        
        //directorio publico
        this.app.use( express.static('public') );
    }

    socketsConfig(){
        new Sockets( this.io );
    }

    routes(){
        
        this.app.use( this.paths.auth, require('../routes/auth' ) );
        this.app.use( this.paths.buyInvoice, require('../routes/buyInvoice' ) );
        this.app.use( this.paths.client, require('../routes/client' ) );
        this.app.use( this.paths.fuels, require('../routes/fuel' ) );
        this.app.use( this.paths.oils, require('../routes/oil' ) );
        this.app.use( this.paths.providers, require('../routes/provider' ) );
        this.app.use( this.paths.sellInvoice, require('../routes/sellInvoice' ) );
        this.app.use( this.paths.schedule, require('../routes/schedule' ) );
        this.app.use( this.paths.turn, require('../routes/turn' ) );
        this.app.use( this.paths.users, require('../routes/users' ) );
    }

    execute() {

        this.socketsConfig();
        
        this.server.listen(this.port, () => {
            console.log('Server listen', this.port );
        });
    }

}

module.exports = Server;