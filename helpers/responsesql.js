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
            dispenser: data.codigo_despachador,
            turn: data.codigo_turn,
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
                price: o.precio_venta,
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
            price: data.precio_venta,
            status: data.status,
            updatedBy: data.updatedBy,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }
    }   
}

module.exports = {
    userReponse,
    scheduleResponse,
    turnResponse,
    fuelResponse,
    oilReponse,
}