const { response } = require('express');
const moment = require('moment');

const { Turn } = require('../models');

const turnsGet = async( req, res = response ) => {
    const { limit = 5, at = 0 } = req.query;
    const query = { status: true };

    try {
        const [ total, turns ] = await Promise.all([
            Turn.countDocuments(query),
            Turn.find(query)
                .skip( Number( at ) )
                .limit(Number( limit ))
        ]);
    
       return res.json({
            total,
            turns
        }); 
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
        const turn = await Turn.findById(id)
                                     .populate('createdBy', 'name');
        return res.json( turn );
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server :c call my creator pls' 
        })
    }
}

const turnPost = async( req, res = response ) => {
    const { startTime, endTime } = req.body;

    try {

        const turnDB = await Turn.findOne({ startTime, endTime });

        if ( turnDB ) {
            return res.status(400).json({
                msg: `Turn ${ startTime } - ${ endTime } already exist.`
            })
        }

        const turn = new Turn({startTime, endTime});
        turn.createdBy = req.user._id;
        turn.createdAt = moment().format('MMMM Do YYYY, h:mm:ss a');
        turn.lastModifiedBy = req.user._id;
        turn.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a');

        turn.save();

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
        const updatedTurn = await Turn.findByIdAndUpdate(id, data, { new: true })
                                            .populate('createdBy', 'name');
                                            
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
        const deletedTurn = await Turn.findByIdAndUpdate( id, 
            { 
                status: false,
                lastModifiedBy: req.user._id,
                datalastModifiedAt: moment().format('MMMM Do YYYY, h:mm:ss a')
            },
            { new: true });
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



