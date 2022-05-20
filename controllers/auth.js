const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJwt } = require('../helpers/jwt')
    

const loginUser = async (req, res = response) => {

    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no son correctos'
            });
        }

        const validPassword = bcrypt.compareSync( password, user.password );

        if ( !validPassword ) {
            res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no son correctos'
            });
        }

        const token = await generateJwt( user.id, user.name );

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Por favor comunicarse con el administrador.'
        });
    }
} 

const renewToken = async (req, res = response) => {

    const token = await generateJwt( req.user._id );
    
    res.json({
        ok: true,
        uid: req.user._id,
        token
    })
} 

module.exports = {
    // createUser,
    loginUser,
    renewToken
}