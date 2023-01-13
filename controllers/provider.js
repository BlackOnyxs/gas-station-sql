const { response } = require('express');
const moment = require('moment');
const { uuid } = require('uuidv4');

const { dbConnection } = require('../database/config');
const { providerResponse } = require('../helpers/responsesql');
const { Provider } = require('../models');

const providersGet = async( req, res = response ) => {
    const { limit = 5, at = 0 } = req.query;

    try {
        const [ providers, count ] = await dbConnection.query(`exec Proveedor_listaActivos ${limit}, ${at}`);
        return res.json({
            providers:  providerResponse(providers),
            count
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const providerGetById = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const provider = await Provider.findById(id)
                                     .populate('createdBy', 'name');
        return res.json( provider );
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        })
    }
}

const providerPost = async( req, res = response ) => {
    const { name, phone } = req.body;

    try {
        const newName = name.split(" ")
        const [ resp ] = await dbConnection.query(`exec Proveedor_crear '${uuid()}', '${newName[0]}', '${newName[1]}', '${phone}','${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
        if ( resp[0].ErrorMessage ) {
            if ( resp[0].ErrorNumber === 50000 ) {
                return res.status(400).json({
                    msg: resp[0].ErrorMessage
                })
            }
            return res.status(500).json({
                msg: resp[0].ErrorMessage,
                numer: resp[0].ErrorNumber
            });
        }
        
        const provider = providerResponse(resp[0]);
        return res.status(201).json(provider);
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const providerPut = async( req, res = response ) => {
    const { id } = req.params;
    const { status, user, lastModifiedBy, lastModifiedAt, ...data } = req.body;

    try {
        const newName = data.name.split(" ")
        const [ resp ] = await dbConnection.query(`exec Proveedor_Actualizar '${id}', '${newName[0]}', '${newName[1]}', '${data.phone}', '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
        if ( resp[0].ErrorMessage ) {
            if ( resp[0].ErrorNumber === 50000 ) {
                return res.status(400).json({
                    msg: resp[0].ErrorMessage
                })
            }
            return res.status(500).json({
                msg: resp[0].ErrorMessage,
                numer: resp[0].ErrorNumber
            });
        }
        
        const client = providerResponse(resp[0]);
        return res.status(201).json(client);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const providerDelete = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const [ resp ] = await dbConnection.query(`exec Proveedor_Eliminar '${id}', '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
        if ( resp[0].ErrorMessage ) {
            if ( resp[0].ErrorNumber === 50000 ) {
                return res.status(400).json({
                    msg: resp[0].ErrorMessage
                })
            }
            return res.status(500).json({
                msg: resp[0].ErrorMessage,
                numer: resp[0].ErrorNumber
            });
        }
        const deletedProvider = providerResponse(resp[0]);
        return res.status(201).json(deletedProvider);

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server' 
        });
    }
}

module.exports = {
    providersGet,
    providerGetById,
    providerPost,
    providerPut,
    providerDelete,
}
