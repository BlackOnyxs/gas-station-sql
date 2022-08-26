const { 
    Role, 
    Fuel, 
    Oil, 
    Provider, 
    Client, 
    Turn, 
    Schedule, 
    User, 
    SellInvoice, 
    BuyInvoice
} = require('../models');

const existObject = async( id = '', collection = '' ) => {
    let existObject = null;
    switch (collection) {
        case 'BuyInvoice':
            existObject = await BuyInvoice.findById(id);
            break;
        case 'Client':
            if ( id.length < 1 ) {
                existObject = await Client.find({ name: 'Default'});
                if ( !existObject ) {
                    throw new Error(`Default client not found. Please created it.`);
                }
            }else {
                existObject = await Client.findById(id);
            }
            break;
        case 'Fuel':
            existObject = await Fuel.findById(id);
            break;
        case 'Provider':
            existObject = await Provider.findById(id);
            break;
        case 'Oil':
            existObject = await Oil.findById(id);
            break;
        case 'Role': 
            existObject = await Role.findById(id);
            break;
        case 'Schedule': 
            existObject = await Schedule.findById(id);
            break;
        case 'SellInvoice': 
            existObject = await SellInvoice.findById(id);
            break;
        case 'Turn': 
            existObject = await Turn.findById(id);
            break;
        case 'User': 
            existObject = await User.findById(id);
            break;
        default:
            throw new Error(`The collection ${ collection } not found`);
    }
    if ( !existObject ) {
        throw new Error(`The id ${ id } not found`);
    }
}

const allowedCollections = ( collection  = '', collections = [] ) => {

    const isIncluded = collections.includes( collection );

    if ( !isIncluded ) {
        throw new Error(`La collecion ${ collection } no es permitida.`);
    }

    return true;
}

const existProduct = async( id = '' ) => {
    let existProduct = null;
    existProduct = await Fuel.findById(id);
    if ( !existProduct ) {
        existProduct = await Oil.findById(id);
    }
    if ( !existProduct ) {
        throw new Error(`The product with id ${ id } not found`);
    }
}

module.exports = {
    existObject,
    existProduct,
    allowedCollections,
}