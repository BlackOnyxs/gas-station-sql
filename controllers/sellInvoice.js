const { response } = require('express');
const moment = require('moment');

const { SellInvoice, Client } = require('../models');

const sellInvoicesGet = async( req, res = response ) => {
    const { limit = 5, at = 0 } = req.query;
    const query = { status: true };

    try {
        const [ total, invoices ] = await Promise.all([
            SellInvoice.countDocuments(query),
            SellInvoice.find(query)
                .skip( Number( at ) )
                .limit(Number( limit ))
                .populate('dispenser', 'name')
                .populate('product', ['name', 'sellPrice'] )
                .populate('client', 'name')
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

const sellInvoicesOwner = async( req, res = response ) => {
    const { dispenser, schedule, limit = 5, at = 0  } = req.body;
    const query = { dispenser, schedule };
    try {
        
        const [ total, invoices ] = await Promise.all([
            SellInvoice.countDocuments(query),
            SellInvoice.find(query)
                        .skip(Number( at ))
                        .limit(Number( limit))
                        .populate('product', ['name', 'sellPrice'] )
                        .populate('client', 'name')
        ])

        return res.json({
            total,
            invoices
        });  
    }catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const sellInvoiceGetById = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const invoice = await SellInvoice.findById(id)
                                         .populate('dispenser', 'name')
                                         .populate('product', ['name', 'sellPrice'] )
                                         .populate('client', 'name');
        return res.json( invoice );
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        })
    }
}



const sellInvoicePost = async( req, res = response ) => {
    let { product, client, dispenser, quantity, total } = req.body;
    let sellInvoice;
    try {

        if ( client.length < 1 ) {
            // console.log('vacio')
            client = await Client.find({ name: 'Default'});
            // console.log({'Encontrado': client})
            sellInvoice = new SellInvoice({ product, client: client._id, dispenser, quantity, total });
        }else {
            sellInvoice = new SellInvoice({ product, client, dispenser, quantity, total });
        }

        
        sellInvoice.createdBy = req.user._id;
        sellInvoice.createdAt = moment().format('MMMM Do YYYY, h:mm:ss a');
        sellInvoice.lastModifiedBy = req.user._id;
        sellInvoice.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a');

        sellInvoice.save();

        return res.status(201).json({
            sellInvoice
        });
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const sellInvoicePut = async( req, res = response ) => {
    const { id } = req.params;
    const { status, user, lastModifiedBy, lastModifiedAt, ...data } = req.body;

    data.user = req.user._id;
    data.lastModifiedBy = req.user._id;
    data.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a')

    try {
        const updatedInvoice = await SellInvoice.findByIdAndUpdate(id, data, { new: true })
                                              .populate('dispenser', 'name')
                                              .populate('product', ['name', 'sellPrice'] )
                                              .populate('client', 'name')
                                              .populate('lastModifiedBy', 'name')
                                            
        res.json( updatedInvoice );
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const sellInvoiceDelete = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const deletedInvoice = await SellInvoice.findByIdAndUpdate( id, 
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
    sellInvoicesGet,
    sellInvoicesOwner,
    sellInvoiceGetById,
    sellInvoicePost,
    sellInvoicePut,
    sellInvoiceDelete,
}


