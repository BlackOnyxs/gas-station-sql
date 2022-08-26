const { response } = require('express');
const moment = require('moment');

const { BuyInvoice } = require('../models');

const buyInvoicesGet = async( req, res = response ) => {
    const { limit = 5, at = 0 } = req.query;
    const query = { status: true };

    try {
        const [ total, invoices ] = await Promise.all([
            BuyInvoice.countDocuments(query),
            BuyInvoice.find(query)
                .skip( Number( at ) )
                .limit(Number( limit ))
                .populate('manager', 'name')
                .populate('product', ['name', 'sellPrice'] )
                .populate('provider', 'name')
        ]);
    
       return res.json({
            total,
            invoices
        }); 
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const buyInvoiceGetById = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const invoice = await BuyInvoice.findById(id)
                                         .populate('manager', 'name')
                                         .populate('product', ['name', 'sellPrice'] )
                                         .populate('provider', 'name');
        return res.json( invoice );
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        })
    }
}

const buyInvoicePost = async( req, res = response ) => {
    let { product, provider, manager, quantity, total } = req.body;

    try {
        const buyInvoice = new BuyInvoice({ product, provider, manager, quantity, total });
        buyInvoice.createdBy = req.user._id;
        buyInvoice.createdAt = moment().format('MMMM Do YYYY, h:mm:ss a');
        buyInvoice.lastModifiedBy = req.user._id;
        buyInvoice.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a');

        buyInvoice.save();

        return res.status(201).json({
            buyInvoice
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const buyInvoicePut = async( req, res = response ) => {
    const { id } = req.params;
    const { status, user, lastModifiedBy, lastModifiedAt, ...data } = req.body;

    data.user = req.user._id;
    data.lastModifiedBy = req.user._id;
    data.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a')

    try {
        const updatedInvoice = await BuyInvoice.findByIdAndUpdate(id, data, { new: true })
                                              .populate('manager', 'name')
                                              .populate('product', ['name', 'sellPrice'] )
                                              .populate('provider', 'name')
                                              .populate('lastModifiedBy', 'name')
                                            
       return res.json( updatedInvoice );
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const buyInvoiceDelete = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const deletedInvoice = await BuyInvoice.findByIdAndUpdate( id, 
            { 
                status: false,
                lastModifiedBy: req.user._id,
                datalastModifiedAt: moment().format('MMMM Do YYYY, h:mm:ss a')
            },
            { new: true });
        res.json( deletedInvoice );

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server' 
        });
    }
}

module.exports = {
    buyInvoicesGet,
    buyInvoiceGetById,
    buyInvoicePost,
    buyInvoicePut,
    buyInvoiceDelete,
}


