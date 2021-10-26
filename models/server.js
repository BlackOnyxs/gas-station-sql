
const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port =  process.env.PORT;
        this.usersPath = '/api/users';

        //middlewares
        this.middlewares();

        //Routes
        this.routes();
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
        
        this.app.use( '/api/users', require('../routes/users' ) );
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server listen', this.port );
        });
    }
}

module.exports = Server;