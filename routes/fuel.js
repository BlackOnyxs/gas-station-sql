const { Router } = require('express');
const { check } = require('express-validator');

const { fuelsGet, fuelGetById, fuelPost, fuelPut, fuelDelete } = require('../controllers/fuel');
const { jwtValidate, hasRole, fieldsValidator, isAdmin } = require('../middlewares');

const router = Router();

router.get('/', [
    jwtValidate,
    hasRole('ADMIN_ROLE', 'DISPENSER_ROLE'),
    fieldsValidator
], fuelsGet );

router.get('/:id', [
    jwtValidate,
    hasRole('ADMIN_ROLE', 'DISPENSER_ROLE'),
    check('id', 'El id es requerido').not().isEmpty(),
    fieldsValidator
], fuelGetById );

router.post('/', [
    jwtValidate,
    isAdmin,
    check('name', 'Name is required').not().isEmpty(),
    check('sellPrice', 'Price is required').not().isEmpty(),
    // check('type', 'Type is required').not().isEmpty(),
    check('octane', 'Octane is required').not().isEmpty(),
    // check('inventory', 'Inventory is required').not().isEmpty(),
    fieldsValidator
], fuelPost );

router.put('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'El id es requerido').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('sellPrice', 'Price is required').not().isEmpty(),
    // check('type', 'Type is required').not().isEmpty(),
    check('octane', 'Octane is required').not().isEmpty(),
    check('inventory', 'Inventory is required').not().isEmpty(),
    fieldsValidator
], fuelPut );

router.delete('/:id', [
    jwtValidate,
    isAdmin,
    check('id', 'El id es requerido').not().isEmpty(),
    // check('id').custom( id => existObject( id, 'Fuel') ),
    fieldsValidator
], fuelDelete );

module.exports = router;