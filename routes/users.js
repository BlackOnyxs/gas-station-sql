
const { Router } = require('express');
const { check } = require('express-validator');

const { usersGet, usersPost, usersPut, usersDelete } = require('../controllers/users');

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
} = require('../helpers/db-validators');
const { existObject } = require('../middlewares/db-validators');

const router = Router();

router.get('/', [
    jwtValidate,
    isAdmin,
    fieldsValidator
], usersGet );

router.get('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( id => existObject((id, 'User')) ),
    fieldsValidator
], usersGet );

router.post(
    '/',
    [
        jwtValidate,
        isAdmin,
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        check('email').custom( emailExist ),
        check('cip','cip is required').not().isEmpty(),
        check('phone','phone is required').not().isEmpty(),
        check('password', 'Password must be greater than 6 characters.').isLength({min: 6}),
        check('password', 'Password is not secure.').isStrongPassword(),
        check('role').custom( isValidRole ),
        fieldsValidator
    ],
    usersPost 
);

router.put('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( id => existObject((id, 'User')) ),
    fieldsValidator
], usersPut );

router.delete('/:id',  [
    jwtValidate,
    isAdmin,
    hasRole( 'ADMIN_ROLE', 'SALE_ROLE' ),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( id => existObject((id, 'User')) ),
    fieldsValidator
], usersDelete );



module.exports =  router;