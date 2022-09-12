const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJwt } = require('../helpers/jwt');
const { dbConnection } = require('../database/config');
    

const loginUser = async (req, res = response) => {

    const { email, password } = req.body;
    
    try {
        // const user = await User.findOne({ email });
        const user = await dbConnection.query(`select * from Colaborador where usuario = '${ email }'`)
        console.log(user)
        
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no son correctos'
            });
        }

        const validPassword = bcrypt.compareSync( password, user.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no son correctos'
            });
        }

        const token = await generateJwt( user.id, user.name );

        return res.json({
            ok: true,
            uid: user.id,
            name: user.name,
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
    const { _id, name } = req.user;

    const token = await generateJwt( _id, name );
    
    res.json({
        ok: true,
        uid: _id,
        name,
        token
    })
} 

module.exports = {
    // createUser,
    loginUser,
    renewToken
}