const { response } = require('express');
const moment = require('moment');
const { uuid } = require('uuidv4');

const { dbConnection } = require('../database/config');
const { oilReponse, fuelResponse, buyInvoiceResponse } = require('../helpers/responsesql');

const { OilBuyInvoice, FuelBuyInvoice, Fuel, Oil } = require('../models');

const buyInvoicesGet = async( req, res = response ) => {
    const { limit = 5, at = 0, productType = 'fuels'} = req.query;
    const query = { status: true, productType };
    // console.log(productType)
    try {
        let model = null;
        if ( productType !== 'fuels' ) {
            model = 'FacturaCompraAceite_listaActivos';
        } else {
            model = 'FacturaCompraCombustible_listaActivos';
        }
        const [ invoices, count ] = await dbConnection.query(`exec ${model} ${limit}, ${at}`);
        return res.json({
            // invoices:  providerResponse(invoices),
            invoices: buyInvoiceResponse(invoices),
            count
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
    const { productType } = req.query;
    try {
        let model = null;
        if ( productType !== 'fuels' ) {
            model = 'FacturaCompraAceite_ObtenerPK';
        } else {
            model = 'FacturaCompraCombustible_ObtenerPK';
        }
        const [ resp ] = await dbConnection.query(`exec ${model} '${id}'`)
        
        return res.json({
            invoice: buyInvoiceResponse(resp[0])
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        })
    }
}

const buyInvoicePost = async( req, res = response ) => {
    let { product, provider, price, quantity, total, productType, date } = req.body;

    try {
        console.log(productType)
        let model = null, productModel = null, getByPK = null;
        if ( productType[0] !== 'fuels' ) {
            model = 'FacturaCompraAceite_Crear';
            productModel = 'Aceite_Actualizar';
            getByPK = 'Aceite_ObtenerPK'
        } else {
            model = 'FacturaCompraCombustible_Crear';
            productModel = 'Combustible_Actualizar';
            getByPK = 'Combustible_ObtenerPK'
        }
        // console.log(productModel)
        
        const [ resp ] = await dbConnection.query(`exec ${model} '${uuid()}', '${moment(date).format('YYYY-MM-DD hh:mm:ss')}', ${total}, ${quantity}, ${price}, '${provider}', '${product}', '${moment().format('DD/MM/yyyy HH:MM:SS')}', '${req.user.codigo_cedula}'`)
        // console.log({resp})
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
        // Se creo correctamente
        

        if ( productType[0] !== 'fuels' ) {
            const [ productToUpdate ] = await dbConnection.query(`exec ${getByPK} '${product}'`);
            // console.log({productToUpdate})
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
            const { _id, name, branch, type, viscosityGrade, size, sellPrice, inventory } = oilReponse(productToUpdate[0]);

            const [ productResp ] = await dbConnection.query(`exec ${productModel} '${_id}', '${name}', '${branch}', '${type}', '${viscosityGrade}', ${(Number(inventory) + Number(quantity))}, '${size}', ${sellPrice}, '${moment().format('DD/MM/yyyy HH:MM:SS')}', '${req.user.codigo_cedula}'`); 
            console.log({productResp})
            if ( productResp[0].ErrorMessage ) {
                if ( productResp[0].ErrorNumber === 50000 ) {
                    return res.status(400).json({
                        msg: productResp[0].ErrorMessage
                    })
                }
                return res.status(500).json({
                    msg: productResp[0].ErrorMessage,
                    numer: productResp[0].ErrorNumber
                });
            }
        } else {
            const [ productToUpdate ] = await dbConnection.query(`exec ${getByPK} '${product}'`);
            if ( productToUpdate[0].ErrorMessage ) {
                if ( productToUpdate[0].ErrorNumber === 50000 ) {
                    return res.status(400).json({
                        msg: productToUpdate[0].ErrorMessage
                    })
                }
                return res.status(500).json({
                    msg: productToUpdate[0].ErrorMessage,
                    numer: productToUpdate[0].ErrorNumber
                });
            }
            const {_id, name, sellPrice, octane, inventory } = fuelResponse(productToUpdate[0]);
            // inventory = inventory + quantity;
            const [ productResp ] = await dbConnection.query(`exec ${productModel} '${_id}', ${sellPrice}, ${(Number(inventory) + Number(quantity))}, '${octane}', '${name}', '${moment().format('DD/MM/yyyy HH:MM:SS')}', '${req.user.codigo_cedula}'`);
            if ( productResp[0].ErrorMessage ) {
                if ( productResp[0].ErrorNumber === 50000 ) {
                    return res.status(400).json({
                        msg: productResp[0].ErrorMessage
                    })
                }
                console.log({productResp})
                return res.status(500).json({
                    msg: productResp[0].ErrorMessage,
                    numer: productResp[0].ErrorNumber
                });
            }
        }
        
        return res.status(201).json({
            invoice: buyInvoiceResponse(resp[0])
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
    const { date, total, price, quantity, product, provider } = data;
    data.user = req.user._id;
    data.lastModifiedBy = req.user._id;
    data.lastModifiedAt = moment().format('YYYY-MM-DD hh:mm:ss');


    try {
        let model = null;
        if ( data.productType[0] !== 'fuels' ) {
            model = 'FacturaCompraAceite_Actualizar';
            //searchModel = 'FacturaCompraAceite_ObtenerPK'
            
        } else {
            model = 'FacturaCompraCombustible_Actualizar2';
            //searchModel = 'FacturaCompraCombustible_ObtenerPK'
        }
        console.log(moment(date).format( 'YYYY-MM-DD hh:mm:ss'))
        const [ resp ] = await dbConnection.query(`exec ${model} '${id}', '${moment(date).format('YYYY-MM-DD hh:mm:ss')}', ${total}, ${quantity}, ${price}, '${provider}', '${product}', '${moment().format('YYYY-MM-DD hh:mm:ss')}', '${req.user.codigo_cedula}'`);
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

        console.log({'test': buyInvoiceResponse(resp[0])})
        return res.json({
            invoice: buyInvoiceResponse(resp[0])
        });
            
        

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const buyInvoiceDelete = async( req, res = response ) => {
    const { id } = req.params;
    const { productType } = req.query;
    try {
        let model = null;
        if ( productType !== 'fuels' ) {
            model = 'FacturaCompraAceite_Eliminar';
            
        } else {
            model = 'FacturaCompraCombustible_Eliminar';
        }
        console.log(model)
        const [ resp ] = await dbConnection.query(`exec ${model} '${id}', '${moment().format('YYYY-MM-DD hh:mm:ss')}', '${req.user.codigo_cedula}'`);
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

        return res.json({
            invoice: buyInvoiceResponse(resp[0])
        });

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


