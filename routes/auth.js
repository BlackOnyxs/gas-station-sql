const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { loginUser, renewToken, loginDispenser } = require('../controllers/auth');
const { fieldsValidator } = require('../middlewares/fields-validators');
const { jwtValidate } = require('../middlewares/jwt-validator');

router.post(
    '/',
    [
        check('email', 'The email is required').isEmail(),
        check('password', 'Password is required').notEmpty(),
        fieldsValidator
    ],
 loginUser 
);

router.post('/mobile',
    [
        check('email', 'The email is required').isEmail(),
        check('password', 'Password is required').notEmpty(),
        fieldsValidator
    ],
    loginDispenser
)

router.get('/renew', jwtValidate, renewToken);

module.exports = router;