const { dbConnection } = require('../database/config');
const { fuelResponse } = require('../helpers/responsesql');


const dashboardStatistics = async( req, res = response ) => {
    const { startDate, endDate } = req.query;
    console.log(startDate, endDate)
    try {
        const dbPromises = [
            dbConnection.query('exec Aceite_CantidadInventario'),
            dbConnection.query('exec Combustible_CantidadInventario'),
            dbConnection.query(`exec Dashboard_VentasDiarias '${startDate}', '${endDate}'`),
            dbConnection.query('exec Despachador_Cantidad'),
            dbConnection.query('exec Proveedor_Cantidad')
        ];
        
        const [
            productsQuantity,
            fuelInventory,
            dailyBuyInvoiceQuantity,
            employeeQuantity,
            providerQuantity
        ] = await Promise.all(dbPromises);
        
        return res.json({
            productsQuantity: productsQuantity[0][0].Cantidad,
            fuelInventory: fuelResponse(fuelInventory[0]),
            dailySellInvoices: dailyBuyInvoiceQuantity[0][0].Total,
            employeeQuantity: employeeQuantity[0][0].Total,
            providerQuantity: providerQuantity[0][0].Total,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

module.exports = {
    dashboardStatistics
}