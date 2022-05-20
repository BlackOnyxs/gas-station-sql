const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJwt } = require('../helpers/jwt');

const usersGet = async(req = request, res = response) => {

    const { limit = 5, at = 0 } = req.query;
    const query = { status: true };

    const [ total, users ] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip( Number( at ) )
            .limit(Number( limit ))
    ]);

    res.json({
        total,
        users
    });
}

const usersPost = async(req, res = response) => {
    
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await user.save();

    // Generar el JWT
    const token = await generateJwt( user.id );

    res.json({
        user,
        token
    });
}

const usersPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, correo, ...resto } = req.body;

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, resto ).setOptions({ new: true });

    res.json(user);
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usersPatch'
    });
}

const usersDelete = async(req, res = response) => {

    const { id } = req.params;
    const user = await User.findByIdAndUpdate( id, { status: false } ).setOptions({new: true});
    
    res.json(user);
}


module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete,
}