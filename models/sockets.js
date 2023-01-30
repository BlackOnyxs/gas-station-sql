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
            console.log({'Token': socket.handshake.query['x-token']})
            const [ valid, uid ] = validateJWTSockets( socket.handshake.query['x-token']);
            
            if ( !valid ) {
                console.log('Nop')
                return socket.disconnect();
            }
            // socket.emit( 'conn', 'hey');
            console.log({'connected': uid })

            // socket.join( uid );

            socket.emit( 'active-invoices', this.invoices.actives );

            socket.on( 'new-invoice', async( payload ) => {
                console.log({ payload })
                this.invoices.addInvoice( payload );
                // console.log({'new': saveInvoice })
                socket.broadcast.emit( 'new-invoice', payload );
            });
        })
    }
}

module.exports = Sockets;