const { response } = require('express');
const moment = require('moment');

const { Fuel } = require('../models');

const fuelsGet = async( req, res = response) => {
    const { limit = 5, at = 0 } = req.query;
    const query = { status: true };

    try {
        const [ total, fuels ] = await Promise.all([
            Fuel.countDocuments(query),
            Fuel.find(query)
                .skip( Number( at ) )
                .limit(Number( limit ))
        ]);
    
       return res.json({
            total,
            fuels
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
    const { name, price, type, octane, inventory, image } = req.body;

    try {

        const fuelDB = await Fuel.findOne({ name });

        if ( fuelDB ) {
            return res.status(400).json({
                msg: `Fuel ${ name } already exist.`
            })
        }

        const fuel = new Fuel({name, price, type, octane, inventory, image});
        fuel.createdBy = req.user._id;
        fuel.createdAt = moment().format('MMMM Do YYYY, h:mm:ss a');
        fuel.lastModifiedBy = req.user._id;
        fuel.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a');

        fuel.save();

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
    data.lastModifiedBy = req.user._id;
    data.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a')

    try {
        const updatedFuel = await Fuel.findByIdAndUpdate(id, data, { new: true })
                                            .populate('createdBy', 'name');
                                            
        res.json( updatedFuel );
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
        const deletedFuel = await Fuel.findByIdAndUpdate( id, 
            { 
                status: false,
                lastModifiedBy: req.user._id,
                datalastModifiedAt: moment().format('MMMM Do YYYY, h:mm:ss a')
            },
            { new: true });
        res.json( deletedFuel );

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