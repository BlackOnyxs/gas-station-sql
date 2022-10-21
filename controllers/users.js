const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const moment = require('moment');

const { generateJwt } = require('../helpers/jwt');
const { dbConnection } = require('../database/config');
const { userReponse } = require('../helpers/responsesql');

const usersGet = async(req = request, res = response) => {

    const { limit = 5, at = 0 } = req.query;

   try {
    // const { count, rows }= await User.findAndCountAll({ limit: Number(limit), offset: Number(at)});
    const [users, count]= await dbConnection.query(`exec ObtenerColaboradoresPaginado ${ Number(limit) }, ${ Number(at) }`);
    return res.json({ count, users: userReponse(users) })
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
        // const user = await User.findByPk(id);
        const [ dbUser] = await dbConnection.query(`exec ObtenerColaboradorPK '${ id }'`);
        let user = userReponse(dbUser[0]);
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
    // console.log({cip, creator: req.user.codigo_cedula})
    try {
        const salt = bcryptjs.genSaltSync();
        password = bcryptjs.hashSync( password, salt );

        const newName = name.split(" ")
        const [ resp ] = await dbConnection.query(`exec spCrearColaborador '${cip}', '${role}', '${newName[0]}', '${newName[1]}', '${email}', '${password}', '${phone}','${moment().format('YYYY/MM/DD')}', '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}'`);
        if ( resp[0].ErrorMessage ) {
            return res.status(500).json({
                msg: resp[0].ErrorMessage,
                numer: resp[0].ErrorNumber
            });
        }
        const user = userReponse(resp[0])

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
    let { password, email, ...data } = req.body;

    try {
        if ( password ) {
            // Encriptar la contraseña
            const salt = bcryptjs.genSaltSync();
            data.password = bcryptjs.hashSync( password, salt );
        }

        const newName = data.name.split(" ")
    
        const [ resp ] = await dbConnection.query(`exec spActualizarColaborador '${id}', '${data.role}', '${newName[0]}', '${newName[1]}', '${email}', '${data.password}', '${data.phone}','${data.createdAt}', '${moment().format('YYYY/MM/DD')}', '${req.user.codigo_cedula}', ${ data.status }`)
        if ( resp[0].ErrorMessage ) {
            return res.status(500).json({
                msg: resp[0].ErrorMessage,
                numer: resp[0].ErrorNumber
            });
        }
        const user = userReponse(resp[0])
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
        const [ resp ] = await dbConnection.query(`exec spEliminarColaborador '${ id }'`);
        if ( resp[0].ErrorMessage ) {
            return res.status(500).json({
                msg: resp[0].ErrorMessage,
                numer: resp[0].ErrorNumber
            });
        }
        
        const user = userReponse(resp[0]);

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