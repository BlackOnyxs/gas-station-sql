class SellInvoicesSocket {
    constructor(){
        this.actives = []
    }

    addInvoice( invoice ) {
        this.actives[invoice._id] = invoice;
        console.log(this.actives)
        return invoice;
    }

    removeInvoice( id ){
        delete this.actives[id];
    }

    updateInvoice( invoice ) {
        this.actives[ invoice._id ] = invoice;
    }
}

module.exports = SellInvoicesSocket;