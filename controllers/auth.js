const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJwt } = require('../helpers/jwt');
const { dbConnection } = require('../database/config');
    

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
            ok: true,
            uid: user.codigo_cedula,
            name: user.nombre,
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
        ok: true,
        uid: codigo_cedula,
        name: nombre,
        token
    })
} 

module.exports = {
    // createUser,
    loginUser,
    renewToken
}