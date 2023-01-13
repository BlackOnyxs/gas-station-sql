const { response } = require('express');
const moment = require('moment');
const { uuid } = require('uuidv4');

const { dbConnection } = require('../database/config');
const { clientResponse } = require('../helpers/responsesql');

const { Client } = require('../models');


const clientsGet = async( req, res = response ) => {
    const { limit = 5, at = 0 } = req.query;

    try {
        const [ clients, count ] = await dbConnection.query(`exec Cliente_ListaActivos ${limit}, ${at}`);
    
        return res.json({
            clients:  clientResponse(clients),
            count
        }); 
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const clientGetById = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const client = await Client.findById(id)
                                     .populate('createdBy', 'name');
        return res.json( client );
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server :c call my creator pls' 
        })
    }
}

const clientPost = async( req, res = response ) => {
    const { name, phone, email } = req.body;

    try {
        const newName = name.split(" ")
        const [ resp ] = await dbConnection.query(`exec Cliente_crear '${uuid()}', '${newName[0]}', '${newName[1]}', '${phone}', '${email}', '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
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
        
        const client = clientResponse(resp[0]);
        return res.status(201).json(client);
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const clientPut = async( req, res = response ) => {
    const { id } = req.params;
    const { status, user, lastModifiedBy, lastModifiedAt, ...data } = req.body;
    console.log(id)
    data.user = req.user._id;
    data.lastModifiedBy = req.user._id;
    data.lastModifiedAt = moment().format('YYYY/MM/DD')
    const newName = data.name.split(" ")

    try {
        const [ resp ] = await dbConnection.query(`exec Cliente_Actualizar '${id}', '${newName[0]}', '${newName[1]}', ${data.phone}, '${data.email}', '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
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
        
        const updatedClient = clientResponse(resp[0]);
        return res.status(201).json(updatedClient);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const clientDelete = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const [ resp ] = await dbConnection.query(`exec Cliente_Eliminar '${id}', '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
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
        const deletedClient = clientResponse(resp[0]);
        return res.status(201).json(deletedClient);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server' 
        });
    }
}

module.exports = {
    clientsGet,
    clientGetById,
    clientPost,
    clientPut,
    clientDelete,
}


