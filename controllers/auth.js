const { response } = require('express');
const bcrypt = require('bcryptjs');
const { DateTime, Interval } = require('luxon');
const moment = require('moment')

const { generateJwt } = require('../helpers/jwt');
const { dbConnection } = require('../database/config');
const { scheduleResponse } = require('../helpers/responsesql');
    

const loginUser = async (req, res = response) => {

    const { email, password } = req.body;
    
    try {
        // const user = await User.findOne({ email });
        const [ dbUser ] = await dbConnection.query(`exec AuthColaborador '${ email }'`);
        let user = dbUser[0];

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no son correctos'
            });
        }

        const validPassword = bcrypt.compareSync( password, user.clave );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no son correctos'
            });
        }

        const token = await generateJwt( user.codigo_cedula, user.nombre );

        return res.json({
            user: {
                uid: user.codigo_cedula,
                name: user.nombre,
            },
            token
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Por favor comunicarse con el administrador.'
        });
    }
} 

const loginDispenser = async (req, res = response) => {
    const { email, password } = req.body;
    
    try {
        // const user = await User.findOne({ email });
        const [ dbUser ] = await dbConnection.query(`exec AuthColaborador '${ email }'`);
        let user = dbUser[0];

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no son correctos'
            });
        }

        const validPassword = bcrypt.compareSync( password, user.clave );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no son correctos'
            });
        }
        //Buscar al despachador x
        //Buscar los turnos de hoy que tengan esa cedula
        // const [ turnResponse ] = await dbConnection.query(`exec Horario_ObtenerPK '2023-01-14 00:00:00', 'C-757-901'`);
        const [ turnResponse ] = await dbConnection.query(`exec Horario_ObtenerPK '${moment().format('YYYY/MM/DD').concat(' 00:00:00')}', '${user.codigo_cedula}'`);
        if ( turnResponse[0].ErrorMessage ) {
            if ( turnResponse[0].ErrorNumber === 50000 ) {
                return res.status(400).json({
                    msg: 'No tienes un turno para hoy.'
                })
            }
            return res.status(500).json({
                msg: turnResponse[0].ErrorMessage,
                numer: turnResponse[0].ErrorNumber
            });
        }
        console.log(turnResponse[0])
        //Si hay turnos creo el intervalo, con la fecha inicial y final
        const {_id, date, total, dispenser, turn, status, updatedBy, createdAt, updatedAt} = scheduleResponse(turnResponse[0]);
        console.log(turn)
        const startTime = turn.startTime.split(':');
        const endTime = turn.endTime.split(':');
        let startDate = DateTime.now().set({ hour: Number(startTime[0]), minute: startTime[1] })
        let endDate = DateTime.now().set({ hour: Number(endTime[0]), minute: endTime[1] })
        const i = Interval.fromDateTimes(startDate, endDate);
        //Verifico si las contiene
        if ( !i.contains( DateTime.now() ) ){
            
            let nextDuration = null
            if ( i.length('hours') < 24 ) {
                nextDuration = i.length('hours')
                return res.status(400).json({
                    msg: `En este momento no tiene turno. Su siguiente turno es en ${nextDuration}`
                })
            }else{
                nextDuration = date
                return res.status(400).json({
                    msg: `En este momento no tiene turno. Su siguiente turno es ${nextDuration}`
                })
            }
        }

        const token = await generateJwt( user.codigo_cedula, user.nombre );
        
        return res.json({
            user: {
                uid: user.codigo_cedula,
                name: user.nombre,
            },
            token
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Por favor comunicarse con el administrador.'
        });
    }
}

const renewToken = async (req, res = response) => {
    const { codigo_cedula, nombre } = req.user;
    const token = await generateJwt( codigo_cedula, nombre );
    
    res.json({
        user: {
            uid: codigo_cedula,
            name: nombre,
        },
        token
    })
} 

module.exports = {
    // createUser,
    loginUser,
    loginDispenser,
    renewToken,
}