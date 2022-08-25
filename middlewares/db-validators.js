const { Role, Fuel } = require('../models');

const isValidRole = async( role = '' ) => {
    const existRol = await Role.findOne({ role });
    if ( !existRol ) {
        throw new Error(`The role ${ role } not found`)
    }
}

const existFuelById= async( id = '' ) => {
    const existFuel = await Fuel.findById(id);
    if ( !existFuel ) {
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
    isValidRole,
    existFuelById,
    allowedCollections,
}