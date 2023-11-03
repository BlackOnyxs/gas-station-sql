const { sellInvoiceGetById } = require('../controllers/sellInvoice');
const { validateJWTSockets } = require('../helpers/jwt');
const SellInvoicesSocket = require('./sellInvoicesSocket');

class Sockets {
    constructor(io) {
        this.io = io;

        this.invoices = new SellInvoicesSocket();

        this.socketEvents();
    }

    socketEvents() {
        this.io.on('connection', async( socket ) => {
            const [ valid, uid ] = validateJWTSockets( socket.handshake.query['x-token']);
            
            if ( !valid ) {
                return socket.disconnect();
            }

            socket.emit( 'active-invoices', this.invoices.actives );

            socket.on( 'new-invoice', async( payload ) => {
                this.invoices.addInvoice( payload );
                socket.broadcast.emit( 'new-invoice', payload );
            });
        })
    }
}

module.exports = Sockets;