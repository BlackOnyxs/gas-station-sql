
const { Router } = require('express');
const { check } = require('express-validator');

const { usersGet, usersPost, usersPut, usersPatch, usersDelete } = require('../controllers/users');

const {
    fieldsValidator,
    jwtValidate,
    hasRole,
    isAdmin
} = require('../middlewares');

const {
    isValidRole,
    emailExist,
    existUserById,
} = require('../helpers/db-validators')

const router = Router();

router.get('/', usersGet );

router.post(
    '/',
    [
        jwtValidate,
        isAdmin,
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        check('email').custom( emailExist ),
        check('password', 'Password must be greater than 6 characters.').isLength({min: 6}),
        // check('password', 'Password is not secure.').isStrongPassword(),
        check('role').custom( isValidRole ),
        fieldsValidator
    ],
    usersPost 
);

router.put('/:id', [
    jwtValidate,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existUserById ),
    fieldsValidator
], usersPut );

router.delete('/:id',  [
    jwtValidate,
    isAdmin,
    hasRole( 'ADMIN_ROLE', 'SALE_ROLE' ),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existUserById ),
    fieldsValidator
], usersDelete );



module.exports =  router;