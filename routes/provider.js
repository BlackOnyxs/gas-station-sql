const { Router } = require('express');
const { check } = require('express-validator');

const { providersGet, providerGetById, providerPost, providerPut, providerDelete } = require('../controllers/provider');
const { fieldsValidator, isAdmin, jwtValidate, hasRole } = require('../middlewares');
const { existObject } = require('../middlewares/db-validators');

const router = Router();

router.get('/', [
    jwtValidate,
    hasRole('ADMIN_ROLE', 'SALE_ROLE'),
    fieldsValidator
], providersGet );

router.get('/:id', [
    jwtValidate,
    hasRole('ADMIN_ROLE', 'SALE_ROLE'),
    check('id', 'Error Id').isMongoId(),
    check('id').custom( id => existObject( id, 'Provider') ),
    fieldsValidator
], providerGetById );

router.post('/', [
    jwtValidate,
    isAdmin,
    check('name', 'Name is required').not().isEmpty(),
    check('telefono', 'telefono is required').not().isEmpty(),
    fieldsValidator
], providerPost );

router.put('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'Error Id').isMongoId(),
    check('id').custom( id => existObject( id, 'Provider') ),
    check('name', 'Name is required').not().isEmpty(),
    check('telefono', 'telefono is required').not().isEmpty(),
    fieldsValidator
], providerPut );

router.delete('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'Error Id').isMongoId(),
    check('id').custom( id => existObject( id, 'Provider') ),
    fieldsValidator
], providerDelete );



module.exports = router;