const { response } = require('express');
const { validationResult } = require('express-validator');

const fieldsValidator = (req, resp = response, next) => {
    const errors = validationResult(req);

    if ( !errors.isEmpty() ) {
       return resp.json({
            ok: false,
            errors: errors.mapped()
        })
    }

    next();
}


module.exports = {
    fieldsValidator
}