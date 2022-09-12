const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const moment = require('moment');
const { uuid } = require('uuidv4');

const { generateJwt } = require('../helpers/jwt');
const { User } = require('../models/user');
const { dbConnection } = require('../database/config');

const usersGet = async(req = request, res = response) => {

    const { limit = 5, at = 0 } = req.query;

   try {
    const { count, rows } = await User.findAndCountAll({
        offset: Number(at),
        limit: Number(limit)
    });
    console.log({ count, rows })
    return res.json({ count, colaboradores: rows })
   } catch (error) {
    console.log(error)
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
    let { name, email, password, role, cip, phone, img } = req.body;
    try {
        const salt = bcryptjs.genSaltSync();
        password = bcryptjs.hashSync( password, salt );
        user.createdBy = req.user._id;
        user.createdAt = moment().format('YYYY/MM/DD');
        user.lastModifiedBy = req.user._id;
        user.lastModifiedAt = moment().format('YYYY/MM/DD');
    
        await user.save();

        // const newId = uuid();
        const newName = name.split(" ")
        const user = await dbConnection.query(`insert into Colaborador(codigo_cedula, rol, nombre, apellido, usuario, clave, telefono, createdAt, updatedAt, createdBy, updatedBy) values (${cip}, ${role}, ${newName[0]}, ${newName[1]}, ${email}, ${password}, ${req.user._id}, ${moment().format('YYYY/MM/DD')}, ${req.user._id}, ${moment().format('YYYY/MM/DD')})`)
        console.log(user)
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