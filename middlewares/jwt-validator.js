const { response } = require('express');
const jwt = require('jsonwebtoken');
const { dbConnection } = require('../database/config');
// const User = require('../models/user');

const jwtValidate = async(req, res = response, next) => {

    //x-api-key
    const token = req.header('x-token');
    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No se envió el token.'
        });
    }

    try {
        const { uid } = jwt.verify(
            token,
            process.env.SEED
        );
        console.log(uid)
        
        // const user = await User.findById(uid);
        const [ dbUser ] = await dbConnection.query(`exec ObtenerColaboradorPK '${ uid }'`);
        let user = dbUser[0];
        if ( !user ) {
            return res.status(401).json({
                msg: 'Token no valido 1 '
            });
        }

        if ( !user.status ) {
            return res.status(401).json({
                msg: 'Token no valido 2 '
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    jwtValidate
}