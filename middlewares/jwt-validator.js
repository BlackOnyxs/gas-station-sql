const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
        
        const user = await User.findById(uid);
        if ( !user ) {
            return res.status(401).json({
                msg: 'Token no valido'
            });
        }

        if ( !user.status ) {
            return res.status(401).json({
                msg: 'Token no valido'
            });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    jwtValidate
}