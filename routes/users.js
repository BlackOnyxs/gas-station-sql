
const { Router } = require('express');
const { check } = require('express-validator');

const { usersGet, usersPost, usersPut, usersPatch, usersDelete } = require('../controllers/users');
const { fieldsValidator } = require('../middlewares/fields-validators');
const { isValidRole, emailExist, existUserById } = require('../middlewares/db-validators');

const router = Router();

router.get('/', usersGet );

router.post(
    '/', 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        check('email').custom( emailExist ),
        check('password', 'Password must be greater than 6 characters.').isLength({min: 6}),
        check('role').custom( isValidRole ),
        fieldsValidator
    ],
    usersPost 
);

router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existUserById ),
    fieldsValidator
], usersPut );

router.delete('/:id',  [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existUserById ),
    fieldsValidator
], usersDelete );



module.exports =  router;