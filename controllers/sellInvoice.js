const { response } = require('express');
const moment = require('moment');
const { uuid } = require('uuidv4');
const { dbConnection } = require('../database/config');
const { sellInvoiceResponse } = require('../helpers/responsesql');

const { SellInvoice, Client } = require('../models');

const sellInvoicesGet = async( req, res = response ) => {
    const { limit = 5, at = 0, productType } = req.query;

    try {
        let model = null;
        if ( productType != 'fuels' ) {
            model = 'FacturaVentaAceite_ListaActivos'
        } else {
            model = 'FacturaVentaCombustible_ListaActivos'
        }

        const [ invoices, count ] = await dbConnection.query(`exec ${model} ${limit}, ${at}`);
        
        return res.json({
            // invoices:  providerResponse(invoices),
            invoices: sellInvoiceResponse(invoices),
            count
        }); 
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const sellInvoicesOwner = async( req, res = response ) => {
    const { limit = 5, at = 0, productType } = req.query;

    try {
        let model = null;
        if ( productType != 'fuels' ) {
            model = 'FacturaVentaAceite_Despachador'
        } else {
            model = 'FacturaVentaCombustible_Despachador'
        }

        const [ invoices, count ] = await dbConnection.query(`exec ${model} ${limit}, ${at}, '${moment().format('DD-MM-yyyy HH:mm:ss')}', '${req.user.codigo_cedula}'`);
        
        return res.json({
            // invoices:  providerResponse(invoices),
            invoices: sellInvoiceResponse(invoices),
            count
        }); 
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const sellInvoiceGetById = async( id, productType ) => {
    // const { id } = req.params;
    // const { productType } = req.query;
    try {
        let model = null;
        if ( productType != 'fuels' ) {
            model = 'FacturaVentaAceite_PK'
        } else {
            model = 'FacturaVentaCombustible_PK'
        }

        const [ resp ] = await dbConnection.query(`exec ${model} '${id}'`);
        
        const invoice = sellInvoiceResponse(resp);

        // return res.json({
        //     invoice
        // }); 
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}



const sellInvoicePost = async( req, res = response ) => {
    let { product, client, dispenser, quantity, total, productType, date, price } = req.body;
    console.log(date )
    try {
        let model = null;
        if ( productType[0] != 'fuels' ) {
            model = 'FacturaVentaAcite_Crear'
        } else {
            model = 'FacturaVentaCombustible_Crear'
        }

        const [ resp ] = await dbConnection.query(`exec ${model} '${uuid()}', ${total}, '${moment(date).format('DD-MM-yyyy HH:mm:ss')}', ${quantity}, ${price}, '${dispenser}', '${product}', '${client}', '${moment().format('DD-MM-yyyy HH:mm:ss')}', '${req.user.codigo_cedula}'`)
        if ( resp[0].ErrorMessage ) {
            console.log(resp[0].ErrorMessage, resp[0].ErrorNumber)
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
        const invoice = sellInvoiceResponse(resp[0])

        return res.status(201).json({
            invoice 
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
    const {product, client, dispenser, quantity, total,  date, price, productType} = data; 
    try {
        let model = null;
        if ( productType[0] != 'fuels' ) {
            model = 'FacturaVentaAceite_Actualizar'
        } else {
            model = 'FacturaVentaCombustible_Actualizar'
        }
        console.log(date)
        const [ resp ] = await dbConnection.query(`exec ${model} '${id}', ${total}, '${date}', ${quantity}, ${price}, '${dispenser}', '${product}', '${client}', '${moment().format('DD-MM-yyyy HH:mm:ss')}', '${req.user.codigo_cedula}'`)
        
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

        const invoice = sellInvoiceResponse(resp[0])

        return res.status(201).json({
            invoice
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const sellInvoiceDelete = async( req, res = response ) => {
    const { id } = req.params;
    const { productType } = req.query;
    try {
        let model = null;
        if ( productType != 'fuels' ) {
            model = 'FacturaVentaAceite_Eliminar'
        } else {
            model = 'FacturaVentaCombustible_Eliminar'
        }

        const [ resp ] = await dbConnection.query(`exec ${model} '${id}', '${moment().format('DD-MM-yyyy HH:mm:ss')}', '${req.user.codigo_cedula}'`)

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
        const invoice = sellInvoiceResponse(resp[0])

        return res.status(201).json({
            invoice
        });


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


