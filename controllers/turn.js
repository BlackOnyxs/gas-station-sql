const { response } = require('express');
const { uuid } = require('uuidv4');
const moment = require('moment');
const { dbConnection } = require('../database/config');
const { turnResponse } = require('../helpers/responsesql');

const { Turn } = require('../models');

const turnsGet = async( req, res = response ) => {
    const { limit = 5, at = 0 } = req.query;

    try {
        const [turns, count]= await dbConnection.query(`exec Turno_listaActivos ${ Number(limit) }, ${ Number(at) }`);
        
        return res.json({ count, turns: turnResponse(turns) })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const turnGetById = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const [ resp ] = await dbConnection.query(`exec Turno_ObtenerPK '${ id }'`);
        if ( resp[0].ErrorMessage ) {
            return res.status(500).json({
                msg: resp[0].ErrorMessage,
                numer: resp[0].ErrorNumber
            });
        }
        
        let user = turnResponse(resp[0]);
        return res.json(user);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        })
    }
}

const turnPost = async( req, res = response ) => {
    const { startTime, endTime } = req.body;

    try {
        const [ resp ] = await dbConnection.query(`exec Turno_Crear '${uuid()}', '${startTime}', '${endTime}','${moment().format('YYYY/MM/DD')}', '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
        if ( resp[0].ErrorMessage ) {
            return res.status(500).json({
                msg: resp[0].ErrorMessage,
                numer: resp[0].ErrorNumber
            });
        }
        const turn = turnResponse(resp[0]);
        return res.status(201).json({
            turn
        });
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const turnPut = async( req, res = response ) => {
    const { id } = req.params;
    const { status, user, lastModifiedBy, lastModifiedAt, ...data } = req.body;

    data.user = req.user._id;
    data.lastModifiedBy = req.user._id;
    data.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a')

    try {
        const [ resp ] = await dbConnection.query(`exec Turno_Actualizar '${id}', '${data.startTime}', '${data.endTime}', '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
        if ( resp[0].ErrorMessage ) {
            return res.status(500).json({
                msg: resp[0].ErrorMessage,
                numer: resp[0].ErrorNumber
            });
        }
        let updatedTurn = turnResponse(resp[0]);                            
        res.json( updatedTurn );
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const turnDelete = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const [ resp ] = await dbConnection.query(`exec Turno_Eliminar '${id}'`)
        if ( resp[0].ErrorMessage ) {
            return res.status(500).json({
                msg: resp[0].ErrorMessage,
                numer: resp[0].ErrorNumber
            });
        }
        const deletedTurn = turnResponse(resp[0]);
        
        res.json( deletedTurn );

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server' 
        });
    }
}

module.exports = {
    turnsGet,
    turnGetById,
    turnPost,
    turnPut,
    turnDelete,
}



