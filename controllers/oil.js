const { response } = require('express');
const moment = require('moment');

const { Oil } = require('../models');

const oilsGet = async( req, res = response ) => {
    const { limit = 5, at = 0 } = req.query;
    const query = { status: true };

    try {
        const [ total, oils ] = await Promise.all([
            Oil.countDocuments(query),
            Oil.find(query)
                .skip( Number( at ) )
                .limit(Number( limit ))
        ]);
    
       return res.json({
            total,
            oils
        }); 
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
            msg: 'Error server :c call my creator pls' 
        })
    }
}

const oilPost = async( req, res = response ) => {
    const { name, price, branch, viscosityGrade, inventory, image, size } = req.body;

    try {

        const oilDB = await Oil.findOne({ name });

        if ( oilDB ) {
            return res.status(400).json({
                msg: `Oil ${ name } already exist.`
            })
        }

        const oil = new Oil({name, price, branch, viscosityGrade, inventory, image, size});
        oil.createdBy = req.user._id;
        oil.createdAt = moment().format('MMMM Do YYYY, h:mm:ss a');
        oil.lastModifiedBy = req.user._id;
        oil.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a');

        oil.save();

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
    const { status, user, ...data } = req.body;

    data.user = req.user._id;
    data.lastModifiedBy = req.user._id;
    data.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a')

    try {
        const updatedOil = await Oil.findByIdAndUpdate(id, data, { new: true })
                                            .populate('createdBy', 'name');
                                            
        res.json( updatedOil );
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
        const deletedOil = await Oil.findByIdAndUpdate( id, 
            { 
                status: false,
                lastModifiedBy: req.user._id,
                datalastModifiedAt: moment().format('MMMM Do YYYY, h:mm:ss a')
            },
            { new: true });
        res.json( deletedOil );

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

