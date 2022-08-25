const { Role, Fuel, Oil, Provider, Client } = require('../models');

// const isValidRole = async( role = '' ) => {
//     const existRol = await Role.findOne({ role });
//     if ( !existRol ) {
//         throw new Error(`The role ${ role } not found`)
//     }
// }

// const existFuelById= async( id = '' ) => {
//     const existFuel = await Fuel.findById(id);
//     if ( !existFuel ) {
//         throw new Error(`The id ${ id } not found`);
//     } 
// }

const existObject = async( id = '', collection = '' ) => {
    let existObject = null;
    switch (collection) {
        case 'Client':
            existObject = await Client.findById(id);
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
        default:
            throw new Error(`The collection ${ collection } not found`);;
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

module.exports = {
    // isValidRole,
    // existFuelById,
    existObject,
    allowedCollections,
}