const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const {  loginUser, renewToken } = require('../controllers/auth');
const { fieldsValidator } = require('../middlewares/fields-validators');
const { jwtValidate } = require('../middlewares/jwt-validator');

// router.post(
//     '/new', 
//     [
//         check('name', 'The name is required').not().isEmpty(),
//         check('email', 'The email is required').isEmail(),
//         check('password', 'Password must be longer than 6 characters').isLength({min: 6}),
//         fieldsValidator
//     ], 
//     createUser 
//     );
router.post(
    '/',
    [
        check('email', 'The email is required').isEmail(),
        check('password', 'Password must be longer than 6 characters').isLength({min: 6}),
        fieldsValidator
    ],
 loginUser 
);

router.get('/renew', jwtValidate, renewToken);

module.exports = router;