
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port =  process.env.PORT;
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

        //DB connection
        this.dbConnection();

        //middlewares
        this.middlewares();

        //Routes
        this.routes();
    }

    async dbConnection(){
        //change by env
        await dbConnection();
    }

    middlewares() {

        //Json parse
        this.app.use( express.json() );

        //cors
        this.app.use( cors() );
        
        //directorio publico
        this.app.use( express.static('public') );
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

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server listen', this.port );
        });
    }
}

module.exports = Server;