const { response } = require('express');
const moment = require('moment');

const { Schedule } = require('../models');


const scheduleGet = async( req, res = response ) => {
    const { limit = 5, at = 0 } = req.query;
    const query = { status: true };

    try {
        const [ total, schedule ] = await Promise.all([
            Schedule.countDocuments(query),
            Schedule.find(query)
                .skip( Number( at ) )
                .limit(Number( limit ))
                .populate('dispenser', 'name')
                .populate('turn', ['startTime', 'endTime'] )
        ]);
    
       return res.json({
            total,
            schedule
        }); 
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
    const { turn, dispenser, date } = req.body;

    try {

        const scheduleDB = await Schedule.findOne({ turn, dispenser, date });

        if ( scheduleDB ) {
            return res.status(400).json({
                msg: `Schedule ${ turn } already exist.`
            })
        }

        const schedule = new Schedule({turn, dispenser, date});
        schedule.createdBy = req.user._id;
        schedule.createdAt = moment().format('MMMM Do YYYY, h:mm:ss a');
        schedule.lastModifiedBy = req.user._id;
        schedule.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a');

        schedule.save();

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
    data.lastModifiedBy = req.user._id;
    data.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a')

    try {
        const updatedSchedule = await Schedule.findByIdAndUpdate(id, data, { new: true })
                                            .populate('createdBy', 'name')
                                            .populate('dispenser', 'name')
                                            .populate('turn', ['startTime', 'endTime'] );
                                            
        res.json( updatedSchedule );
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const scheduleDelete = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const deletedSchedule = await Schedule.findByIdAndUpdate( id, 
            { 
                status: false,
                lastModifiedBy: req.user._id,
                datalastModifiedAt: moment().format('MMMM Do YYYY, h:mm:ss a')
            },
            { new: true });
        res.json( deletedSchedule );

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
