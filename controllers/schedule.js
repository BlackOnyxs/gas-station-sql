const { response } = require('express');
const moment = require('moment');
const { dbConnection } = require('../database/config');
const { scheduleResponse } = require('../helpers/responsesql');

const { Schedule } = require('../models');


const scheduleGet = async( req, res = response ) => {
    const { limit = 5, at = 0 } = req.query;

    try {
        const [schedule, count]= await dbConnection.query(`exec Horario_ListaActivos ${ Number(limit) }, ${ Number(at) }`);
        return res.json({ count, schedule: scheduleResponse(schedule) });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const scheduleGetById = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const schedule = await Schedule.findById(id)
                                     .populate('createdBy', 'name')
                                     .populate('dispenser', 'name')
                                     .populate('turn', ['startTime', 'endTime'] );
        return res.json( schedule );
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        })
    }
}

const schedulePost = async( req, res = response ) => {
    const { turn, dispenser, date, total } = req.body;

    try {
        const [ resp ] = await dbConnection.query(`exec Horario_Crear '${moment(date).format('YYYY/MM/DD')}', '${turn}','${dispenser}','${moment().format('YYYY/MM/DD')}', '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
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
        
        const schedule = scheduleResponse(resp[0]);

        return res.status(201).json({
            schedule
        });
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const schedulePut = async( req, res = response ) => {
    const { id } = req.params;
    const { status, user, lastModifiedBy, lastModifiedAt, ...data } = req.body;

    data.user = req.user._id;
    data.updatedBy = req.user._id;
    data.updatedAt = moment().format('YYYY/MM/DD')

    try {
        const [ resp ] = await dbConnection.query(`exec Horario_Actualizar '${moment(data.date).format('YYYY/MM/DD')}', '${data.total}', '${data.turn}','${data.dispenser}', '${data.updatedAt}', '${req.user.codigo_cedula}'`);
        if ( resp[0].ErrorMessage ) {
            return res.status(500).json({
                msg: resp[0].ErrorMessage,
                numer: resp[0].ErrorNumber
            });
        }
        const  updatedSchedule = scheduleResponse(resp[0]);

        return res.status(201).json({
            updatedSchedule
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const scheduleDelete = async( req, res = response ) => {
    const { turn, dispenser, date } = req.body;
    try {
        const [ resp ] = await dbConnection.query(`exec Horario_Eliminar '${moment(date).format('YYYY/MM/DD')}','${turn}','${dispenser}', '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
        if ( resp[0].ErrorMessage ) {
            return res.status(500).json({
                msg: resp[0].ErrorMessage,
                numer: resp[0].ErrorNumber
            });
        }
        const deletedSchedule = scheduleResponse(resp[0]);

        return res.status(201).json({
            deletedSchedule
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server' 
        });
    }
}

module.exports = {
    scheduleGet,
    scheduleGetById,
    schedulePost,
    schedulePut,
    scheduleDelete,
}
