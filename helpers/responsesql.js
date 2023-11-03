const { uuid } = require("uuidv4");

const userReponse = ( data ) => {
    if ( Array.isArray(data) ) {
        const newUsers = [];
        data.forEach( user => {
            const newUser = {
                uid: user.codigo_cedula,
                cip: user.codigo_cedula,
                name: user.nombre + ' ' + user.apellido,
                email: user.usuario,
                role: user.rol,
                phone:  user.telefono,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                updatedBy: user.updatedBy,
                status: user.status
            }
            newUsers.push(newUser)
        })
        return newUsers;
    } else {
        return {
            uid: data.codigo_cedula,
            cip: data.codigo_cedula,
            name: data.nombre + ' ' + data.apellido,
            email: data.usuario,
            role: data.rol,
            phone:  data.telefono,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy,
            status: data.status
        }
    } 
}

const turnResponse = ( data ) => {
    if ( Array.isArray(data) ) {
        const newTurns = [];
        data.forEach( turn => {
            const newTurn = {
                _id: turn.codigo_turno,
                startTime: turn.horaInicio,
                endTime: turn.horaFinal,
                status: turn.status,
                updatedBy: turn.updatedBy,
                createdAt: turn.createdAt,
                updatedAt: turn.updatedAt
            }
            newTurns.push(newTurn);
        });
        return newTurns;
    } else {
        return {
            _id: data.codigo_turno,
            startTime: data.horaInicio,
            endTime: data.horaFinal,
            status: data.status,
            updatedBy: data.updatedBy,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
    }
}

const scheduleResponse = ( data ) => {
    if ( Array.isArray(data) ) {
        const newSchedules = [];
        data.forEach( schedule => {
            const newSchedule = {
                _id: uuid(),
                date: schedule.fecha,
                total: schedule.monto,
                dispenser: {
                    uid: schedule.codigo_cedula,
                    name: schedule.nombre + ' ' + schedule.apellido
                },
                turn: {
                    _id: schedule.codigo_turno,
                    startTime: schedule.horaInicio,
                    endTime: schedule.horaFinal
                },
                status: schedule.status,
                updatedBy: schedule.updatedBy,
                createdAt: schedule.createdAt,
                updatedAt: schedule.updatedAt
            }
            newSchedules.push(newSchedule);
        });
        return newSchedules;
    } else {
        return {
            _id: uuid(),
            date: data.fecha,
            total: data.monto,
            dispenser: {
                uid: data.codigo_cedula,
                name: data.nombre + ' ' + data.apellido
            },
            turn: {
                _id: data.codigo_turno,
                startTime: data.horaInicio,
                endTime: data.horaFinal
            },
            status: data.status,
            updatedBy: data.updatedBy,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
    }
}

const fuelResponse = ( data ) => {
    if ( Array.isArray( data ) ) {
        const newFuels = [];
        data.forEach( f => {
            const newFuel = {
                _id: f.codigo_combustible,
                name: f.nombre,
                sellPrice: f.precio_litro,
                octane: f.octanage,
                inventory: f.inventario_actual,
                productType: ['fuels'],
                status: f.status,
                updatedBy: f.updatedBy,
                createdAt: f.createdAt,
                updatedAt: f.updatedAt
            }
            newFuels.push(newFuel);
        });
        return newFuels;
    }else{
        return {
            _id: data.codigo_combustible,
            name: data.nombre,
            sellPrice: data.precio_litro,
            octane: data.octanage,
            inventory: data.inventario_actual,
            productType: ['fuels'],
            status: data.status,
            updatedBy: data.updatedBy,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
    }
}

const oilReponse = ( data ) => {
    if ( Array.isArray(data) ) {
        const newOils = [];
        data.forEach( o => {
            const newOil = {
                _id: o.codigo_aceite,
                name: o.nombre,
                branch: o.marca,
                type: o.tipo,
                viscosityGrade: o.grado_viscosidad,
                size: o.unidad,
                sellPrice: o.precio_venta,
                inventory: o.inventario,
                productType: ['oils'],
                status: o.status,
                updatedBy: o.updatedBy,
                createdAt: o.createdAt,
                updatedAt: o.updatedAt,
            }
            newOils.push(newOil);
        });
        return newOils;
    }else {
        return {
            _id: data.codigo_aceite,
            name: data.nombre,
            branch: data.marca,
            type: data.tipo,
            viscosityGrade: data.grado_viscosidad,
            size: data.unidad,
            sellPrice: data.precio_venta,
            inventory: data.inventario,
            productType: ['oils'],
            status: data.status,
            updatedBy: data.updatedBy,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }
    }   
}

const clientResponse = ( data ) => {
    if ( Array.isArray(data) ) {
        const newTurns = [];
        data.forEach( client => {
            const newclient = {
                _id: client.codigo_cliente,
                name: `${ client.nombre } ${client.apellido }`,
                phone: client.telefono,
                email: client.email,
                status: client.status,
                updatedBy: client.updatedBy,
                createdAt: client.createdAt,
                updatedAt: client.updatedAt
            }
            newTurns.push(newclient);
        });
        return newTurns;
    } else {
        return {
            _id: data.codigo_cliente,
            name: `${`${ data.nombre } ${data.apellido }` }`,
            phone: data.telefono,
            email: data.email,
            status: data.status,
            updatedBy: data.updatedBy,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
    }
}
const providerResponse = ( data ) => {
    if ( Array.isArray(data) ) {
        const newProviders = [];
        data.forEach( provider => {
            const newProvider = {
                _id: provider.codigo_proveedor,
                name: `${ provider.nombre } ${provider.apellido }`,
                phone: provider.telefono,
                status: provider.status,
                updatedBy: provider.updatedBy,
                createdAt: provider.createdAt,
                updatedAt: provider.updatedAt
            }
            newProviders.push(newProvider);
        });
        return newProviders;
    } else {
        return {
            _id: data.codigo_proveedor,
            name: `${`${ data.nombre } ${data.apellido }` }`,
            phone: data.telefono,
            status: data.status,
            updatedBy: data.updatedBy,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
    }
}

const buyInvoiceResponse = ( data ) => {
    if ( Array.isArray(data) ) {
        const newInvoices = [];
        data.forEach( invoice => {
            const newInvoice = {
                _id: invoice.codigo_factura,
                date: invoice.fecha,
                total: invoice.monto,
                price: invoice.precio_compra,
                quantity: invoice.cantidad,
                product: (invoice.aceite) ? {
                    _id: invoice.codigo_aceite,
                    name: invoice.aceite,
                    sellPrice: invoice.precio_venta, 
                    productType: ['oils']
                } 
                : {
                    _id: invoice.codigo_combustible,
                    name: invoice.combustible,
                    sellPrice: invoice.precio_litro,
                    productType: ['fuels']
                },
                provider: {
                    _id: invoice.codigo_proveedor,
                    name: invoice.proveedor
                },
                status: invoice.status,
                updatedBy: {
                    _id: invoice.updatedBy,
                    name: invoice.colaborador
                },
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt
            }
            newInvoices.push(newInvoice);
        });
        return newInvoices;
    } else {
        return {
            _id: data.codigo_factura,
            date: data.fecha,
            total: data.monto,
            price: data.precio_compra,
            quantity: data.cantidad,
            product: (data.aceite) ? {
                _id: data.codigo_aceite,
                name: data.aceite,
                sellPrice: data.precio_venta, 
                productType: ['oils']
            } 
            : {
                _id: data.codigo_combustible,
                name: data.combustible,
                sellPrice: data.precio_litro,
                productType: ['fuels']
            },
            provider: {
                _id: data.codigo_proveedor,
                name: data.proveedor
            },
            status: data.status,
            updatedBy: {
                _id: data.updatedBy,
                name: data.colaborador
            },
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
    }
}

const sellInvoiceResponse = ( data ) => {
    if ( Array.isArray(data) ) {
        const newInvoices = [];
        data.forEach( invoice => {
            const newInvoice = {
                _id: invoice.codigo_factura,
                date: invoice.fecha,
                total: invoice.monto,
                price: invoice.precio_venta,
                quantity: invoice.cantidad,
                dispenser: {
                    _id: invoice.codigo_despachador,
                    name: invoice.despachador
                },
                client: {
                    _id: invoice.codigo_cliente,
                    name: invoice.cliente
                },
                product: (invoice.aceite) ? {
                    _id: invoice.codigo_aceite,
                    name: invoice.aceite,
                    sellPrice: invoice.precio_venta, 
                    productType: ['oils']
                } 
                : {
                    _id: invoice.codigo_combustible,
                    name: invoice.combustible,
                    sellPrice: invoice.precio_litro,
                    productType: ['fuels']
                },
                status: invoice.status,
                updatedBy: {
                    _id: invoice.updatedBy,
                    name: invoice.colaborador
                },
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt,
            }
            newInvoices.push(newInvoice);
        });
        return newInvoices;
    } else {
        return {
            _id: data.codigo_factura,
            date: data.fecha,
            total: data.monto,
            price: data.precio_venta,
            quantity: data.cantidad,
            dispenser: {
                _id: data.codigo_despachador,
                name: data.despachador
            },
            client: {
                _id: data.codigo_cliente,
                name: data.cliente
            },
            product: (data.aceite) ? {
                _id: data.codigo_aceite,
                name: data.aceite,
                sellPrice: data.precio_venta, 
                productType: ['oils']
            } 
            : {
                _id: data.codigo_combustible,
                name: data.combustible,
                sellPrice: data.precio_litro,
                productType: ['fuels']
            },
            status: data.status,
            updatedBy: {
                _id: data.updatedBy,
                name: data.colaborador
            },
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }
    }
}



module.exports = {
    buyInvoiceResponse,
    clientResponse,
    fuelResponse,
    oilReponse,
    providerResponse,
    scheduleResponse,
    sellInvoiceResponse,
    turnResponse,
    userReponse,
}