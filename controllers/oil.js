const { response } = require('express');
const moment = require('moment');
const { uuid } = require('uuidv4');
const { dbConnection } = require('../database/config');
const { oilReponse } = require('../helpers/responsesql');

const { Oil } = require('../models');

const oilsGet = async( req, res = response ) => {
    const { limit = 5, at = 0 } = req.query;
    const query = { status: true };

    try {
        const [ oils, count ] = await dbConnection.query(`exec Aceite_listaActivos ${limit}, ${at}`);
        return res.json({ count, oils: oilReponse(oils) });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const oilGetById = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const oil = await Oil.findById(id)
                                     .populate('createdBy', 'name');
        return res.json( oil );
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        })
    }
}

const oilPost = async( req, res = response ) => {
    const { name, price, branch, viscosityGrade, size, type } = req.body;

    try {
        const [ resp ] = await dbConnection.query(`exec Aceite_Crear '${uuid()}', '${name}', '${branch}', '${type}', '${viscosityGrade}', '${size}', ${price}, '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
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
        
        const oil = oilReponse(resp[0]);
        return res.status(201).json({
            oil
        });
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const oilPut = async( req, res = response ) => {
    const { id } = req.params;
    const { status, user, lastModifiedBy, lastModifiedAt, ...data } = req.body;

    data.user = req.user._id;
    data.updatedBy = req.user._id;
    data.updatedAt = moment().format('YYYY/MM/DD');

    try {
        const [ resp ] = await dbConnection.query(`exec Aceite_Actualizar '${id}', '${data.name}', '${data.branch}', '${data.type}', '${data.viscosityGrade}', '${data.size}', ${data.price}, '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
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
        
        const updatedOil = oilReponse(resp[0]);
        return res.status(201).json({
            updatedOil
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const oilDelete = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const [ resp ] = await dbConnection.query(`exec Aceite_Eliminar '${id}', '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
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
        
        const deletedOil = oilReponse(resp[0]);
        return res.status(201).json({
            deletedOil
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server' 
        });
    }
}

module.exports = {
    oilsGet,
    oilGetById,
    oilPost,
    oilPut,
    oilDelete,
}

