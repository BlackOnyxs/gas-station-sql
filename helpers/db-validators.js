const User = require("../models/user");
const Role = require('../models/role');
const { response } = require("express");

const isValidRole = async( role = '' ) => {
    const existRol = await Role.findOne({ role });
    console.log(existRol)
    if ( !existRol ) {
        throw new Error(`The role ${ role } not found`)
    }
}


const emailExist = async( email = '' ) => {
    const emailExist = await User.findOne({ email });
    if ( emailExist ) {
        throw new Error(`The email ${ email } is already in use`);
    }
}

const existUserById = async( id = '' ) => {
    const existUser = await User.findById(id);
    if ( !existUser ) {
        throw new Error(`The id ${ id } not found`);
    }
}

module.exports = {
    isValidRole,
    emailExist,
    existUserById
}