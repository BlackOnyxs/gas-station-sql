const { response } = require('express');
const moment = require('moment');
const { uuid } = require('uuidv4');
const { dbConnection } = require('../database/config');
const { fuelResponse } = require('../helpers/responsesql');

const { Fuel } = require('../models');

const fuelsGet = async( req, res = response) => {
    const { limit = 5, at = 0 } = req.query;

    try {
        const [ fuels, count ] = await dbConnection.query(`exec Combustible_listaActivos ${limit}, ${at}`);
        return res.json({
            fuels:  fuelResponse(fuels),
            count
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const fuelGetById = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const fuel = await Fuel.findById(id)
                                     .populate('createdBy', 'name');
        return res.json( fuel );
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server :c call my creator pls' 
        })
    }
}

const fuelPost = async( req, res = response ) => {
    const { name, sellPrice, octane } = req.body;

    try {
        const [ resp ] = await dbConnection.query(`exec Combustible_Crear '${uuid()}', ${sellPrice}, '${octane}', '${name}', '${moment().format('YYYY-MM-DD hh:mm:ss')}', '${req.user.codigo_cedula}'`);
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
        
        const fuel = fuelResponse(resp[0]);
        return res.status(201).json({
            fuel
        });
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const fuelPut = async(req, res = response) => {
    const { id } = req.params;
    const { status, user, lastModifiedBy, lastModifiedAt, ...data } = req.body;

    data.user = req.user._id;
    data.updatedBy = req.user._id;
    data.updatedAt = moment().format('YYYY/MM/DD');

    try {
        const [ resp ] = await dbConnection.query(`exec Combustible_Actualizar '${id}', ${data.sellPrice}, ${data.inventory}, '${data.octane}', '${data.name}', '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
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
        
        const updatedFuel = fuelResponse(resp[0]);
        return res.status(201).json({
            updatedFuel
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const fuelDelete = async(req, res = response) => {
    const { id } = req.params;

    try {
        const [ resp ] = await dbConnection.query(`exec Combustible_Eliminar '${id}', '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
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
        
        const deletedFuel = fuelResponse(resp[0]);
        return res.status(201).json({
            deletedFuel
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server' 
        });
    }
}


module.exports = {
    fuelsGet,
    fuelGetById,
    fuelPost,
    fuelPut,
    fuelDelete,
}