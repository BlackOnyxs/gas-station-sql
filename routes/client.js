const { Router } = require('express');
const { check } = require('express-validator');
const { clientsGet, clientGetById, clientPost, clientPut, clientDelete } = require('../controllers/client');

const { jwtValidate, hasRole, fieldsValidator, isAdmin } = require('../middlewares');
const { existObject } = require('../middlewares/db-validators');

const router = Router();

router.get('/', [
    jwtValidate,
    hasRole('ADMIN_ROLE', 'SALE_ROLE'),
    fieldsValidator
], clientsGet );

router.get('/:id', [
    jwtValidate,
    hasRole('ADMIN_ROLE', 'SALE_ROLE'),
    check('id', 'El id es requerido').not().isEmpty(),
    fieldsValidator
], clientGetById );

router.post('/', [
    jwtValidate,
    isAdmin,
    check('name', 'Name is required').not().isEmpty(),
    check('phone', 'phone is required').not().isEmpty(),
    check('email', 'email is required').not().isEmpty(),
    fieldsValidator
], clientPost );

router.put('/:id', [
    jwtValidate,
    isAdmin,
    check('name', 'Name is required').not().isEmpty(),
    check('phone', 'phone is required').not().isEmpty(),
    check('email', 'email is required').not().isEmpty(),
    fieldsValidator
], clientPut );

router.delete('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'El id es requerido').not().isEmpty(),
    fieldsValidator
], clientDelete );


module.exports = router;