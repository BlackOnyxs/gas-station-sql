const { Router } = require('express');
const { check } = require('express-validator');

const { providersGet, providerGetById, providerPost, providerPut, providerDelete } = require('../controllers/provider');
const { fieldsValidator, isAdmin, jwtValidate, hasRole } = require('../middlewares');

const router = Router();

router.get('/', [
    jwtValidate,
    isAdmin,
    fieldsValidator
], providersGet );

router.get('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'El id es requerido').not().isEmpty(),
    fieldsValidator
], providerGetById );

router.post('/', [
    jwtValidate,
    isAdmin,
    check('name', 'Name is required').not().isEmpty(),
    check('phone', 'phone is required').not().isEmpty(),
    fieldsValidator
], providerPost );

router.put('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'El id es requerido').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('phone', 'phone is required').not().isEmpty(),
    fieldsValidator
], providerPut );

router.delete('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'El id es requerido').not().isEmpty(),
    fieldsValidator
], providerDelete );



module.exports = router;