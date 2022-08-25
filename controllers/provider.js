const { response } = require('express');
const moment = require('moment');

const { Provider } = require('../models');

const providersGet = async( req, res = response ) => {
    const { limit = 5, at = 0 } = req.query;
    const query = { status: true };

    try {
        const [ total, providers ] = await Promise.all([
            Provider.countDocuments(query),
            Provider.find(query)
                .skip( Number( at ) )
                .limit(Number( limit ))
        ]);
    
       return res.json({
            total,
            providers
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
            msg: 'Error server :c call my creator pls' 
        })
    }
}

const providerPost = async( req, res = response ) => {
    const { name, telefono } = req.body;

    try {

        const providerDB = await Provider.findOne({ name });

        if ( providerDB ) {
            return res.status(400).json({
                msg: `Provider ${ name } already exist.`
            })
        }

        const provider = new Provider({name, telefono});
        provider.createdBy = req.user._id;
        provider.createdAt = moment().format('MMMM Do YYYY, h:mm:ss a');
        provider.lastModifiedBy = req.user._id;
        provider.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a');

        provider.save();

        return res.status(201).json({
            provider
        });
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

    data.user = req.user._id;
    data.lastModifiedBy = req.user._id;
    data.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a')

    try {
        const updatedProvider = await Provider.findByIdAndUpdate(id, data, { new: true })
                                            .populate('createdBy', 'name');
                                            
        res.json( updatedProvider );
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
        const deletedProvider = await Provider.findByIdAndUpdate( id, 
            { 
                status: false,
                lastModifiedBy: req.user._id,
                datalastModifiedAt: moment().format('MMMM Do YYYY, h:mm:ss a')
            },
            { new: true });
        res.json( deletedProvider );

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
