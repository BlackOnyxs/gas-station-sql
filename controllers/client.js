const { response } = require('express');
const moment = require('moment');

const { Client } = require('../models');


const clientsGet = async( req, res = response ) => {
    const { limit = 5, at = 0 } = req.query;
    const query = { status: true };

    try {
        const [ total, clients ] = await Promise.all([
            Client.countDocuments(query),
            Client.find(query)
                .skip( Number( at ) )
                .limit(Number( limit ))
        ]);
    
       return res.json({
            total,
            clients
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
    const { name } = req.body;

    try {

        const clientDB = await Client.findOne({ name });

        if ( clientDB ) {
            return res.status(400).json({
                msg: `Client ${ name } already exist.`
            })
        }

        const client = new Client({name});
        client.createdBy = req.user._id;
        client.createdAt = moment().format('MMMM Do YYYY, h:mm:ss a');
        client.lastModifiedBy = req.user._id;
        client.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a');

        client.save();

        return res.status(201).json({
            client
        });
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

    data.user = req.user._id;
    data.lastModifiedBy = req.user._id;
    data.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a')

    try {
        const updatedClient = await Client.findByIdAndUpdate(id, data, { new: true })
                                            .populate('createdBy', 'name');
                                            
        res.json( updatedClient );
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
        const deletedClient = await Client.findByIdAndUpdate( id, 
            { 
                status: false,
                lastModifiedBy: req.user._id,
                datalastModifiedAt: moment().format('MMMM Do YYYY, h:mm:ss a')
            },
            { new: true });
        res.json( deletedClient );

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


