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
const validateJWTSockets = ( token = '' ) => {
    try {
        const { uid } = jwt.verify( token, process.env.SEED );
        return [ true, { uid } ]; 
    } catch (error) {
        return [false, null]
    }
}
module.exports = {
    generateJwt,
    validateJWTSockets
}