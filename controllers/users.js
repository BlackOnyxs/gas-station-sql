const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const moment = require('moment');

const User = require('../models/user');
const { generateJwt } = require('../helpers/jwt');

const usersGet = async(req = request, res = response) => {

    try {
        const { limit = 5, at = 0 } = req.query;
        const query = { status: true };

        const [ total, users ] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip( Number( at ) )
                .limit(Number( limit ))
        ]);

        return res.json({
             total,
             users
         });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const userGetById = async( req, res = response ) => {
    const { id } = req.params;

    try {
        const user = await User.findById( id );
        return res.json(user);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const usersPost = async(req, res = response) => {
    const { name, email, password, role, cip, phone, img } = req.body;
    try {
        
        const user = new User({ name, email, password, role, cip, phone, img });
    
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync( password, salt );
        user.createdBy = req.user._id;
        user.createdAt = moment().format('MMMM Do YYYY, h:mm:ss a');
        user.lastModifiedBy = req.user._id;
        user.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a');
    
        await user.save();
    
        // Generar el JWT
        const token = await generateJwt( user.id );
    
        return res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }
}

const usersPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, correo, ...data } = req.body;

    try {
        if ( password ) {
            // Encriptar la contraseña
            const salt = bcryptjs.genSaltSync();
            data.password = bcryptjs.hashSync( password, salt );
        }

        data.user = req.user._id;
        data.lastModifiedBy = req.user._id;
        data.lastModifiedAt = moment().format('MMMM Do YYYY, h:mm:ss a')
    
        const user = await User.findByIdAndUpdate( id, data ).setOptions({ new: true })
                                populate('createdBy', 'name');
    
        return res.json(user);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server.' 
        });
    }

}


const usersDelete = async(req, res = response) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndUpdate( id, 
            { 
                status: false,
                lastModifiedBy: req.user._id,
                datalastModifiedAt: moment().format('MMMM Do YYYY, h:mm:ss a')
            },
            { new: true} );

        return res.json(user);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error server' 
        });
    }
}


module.exports = {
    usersGet,
    userGetById,
    usersPost,
    usersPut,
    usersDelete,
}