const jwt = require('jsonwebtoken');

const generateJwt = (uid, name) => {

    return new Promise( (resolve, reject) => {
        const payload = { uid, name };

        jwt.sign( payload, process.env.SEED, {
            expiresIn: '8h'
        }, (err, token) =>{
            if ( err) {
                console.log(err);
                reject('No se pudo generar el token.');
            }
            resolve( token );
        });
    })
}

module.exports = {
    generateJwt
}