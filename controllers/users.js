const { response } = require('express');

const getUsers = ( req, resp = response ) => {
    return resp.json({
        ok: true,
        msg: 'get users'
    });
}
const createUser = ( req, resp = response ) => {
    return resp.json({
        ok: true,
        msg: 'create user'
    });
}
const updateUser = ( req, resp = response ) => {
    return resp.json({
        ok: true,
        msg: 'update user'
    });
}
const deleteUser = ( req, resp = response ) => {
    return resp.json({
        ok: true,
        msg: 'delete User'
    });
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
}